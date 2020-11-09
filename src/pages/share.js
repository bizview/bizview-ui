import React, { useState, useEffect, useContext, useCallback } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Form, Button, Select, Checkbox, Spin, Card, Table, message, Popconfirm } from "antd";
import { findUsersAndGroups } from "../service/user_service";
import {
  findRoleAssignmentBySiteIdAndPrincipleId,
  createRoleAssignments,
  deleteRoleAssignments,
  getPermissionGroups,
  getRoleAssignments
} from "../service/share_service";
import { PageContext } from "../service/util_service";
import DefaultLayout from "../components/default_layout/default_layout";
import styles from "./share.module.css";

const CheckboxGroup = Checkbox.Group;

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 }
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 16 }
};

function ShareEditForm(props) {
  let { siteInfo } = useContext(PageContext);
  const id = props.match.params.id;
  const [fetching, setFetching] = useState(false);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleAssignments, setRoleAssignments] = useState(null);
  const handleSubmit = async (values) => {
    const assignments = [];
    values.user.forEach(u => {
      values.permissions.forEach(p => {
        assignments.push({
          siteId: siteInfo.siteId,
          user: { id: u.key },
          permissionGroup: {
            id: p
          }
        });
      });
    });
    await createRoleAssignments(siteInfo.siteId, assignments);
    window.location.href = "#/";
  };

  const fetchUser = async name => {
    if (!name) return;
    try {
      setFetching(true);
      const users = await findUsersAndGroups(name);
      const plainUsers = users.map(user => ({
        text: `${user.name}`,
        value: user.id
      }));
      setUsers(plainUsers);
    } catch (e) {
      message.error(e.toString());
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    async function fetch() {
      try {
        const permissions = await getPermissionGroups();
        if (id) {
          const roleAssignments = await findRoleAssignmentBySiteIdAndPrincipleId(siteInfo.siteId, id);
          setRoleAssignments(roleAssignments);
        }
        setPermissions(permissions);
      } catch (e) {
        message.error(e.toString());
      }
    }

    fetch().then();
  }, [siteInfo.siteId, id]);
  if (id && !roleAssignments) {
    return <Spin/>;
  }
  return (
    <Form onFinish={handleSubmit} {...layout} initialValues={{
      user: roleAssignments ? [{ label: roleAssignments[0].user.name, key: roleAssignments[0].user.id }] : undefined,
      permissions: roleAssignments ? roleAssignments.map(o => o.permissionGroup.id) : []
    }}>
      <Form.Item name={"user"} label="选择用户/组"
                 rules={[{ required: true, message: "Please select at lease one user or group!" }]}>
        <Select mode="multiple" labelInValue placeholder="Select users"
                notFoundContent={fetching ? <Spin size="small"/> : null} filterOption={false}
                onSearch={fetchUser} style={{ width: "100%", minWidth: "320px" }}>
          {users.map(d => (
            <Select.Option key={d.value} value={d.value}>
              {d.text}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="权限" name={"permissions"} rules={[{
        required: true,
        message: "Please select at lease one permission!"
      }]}>
        <CheckboxGroup options={permissions.map(p => ({ label: p.name, value: p.id }))}/>
      </Form.Item>
      <Form.Item  {...tailLayout}>
        <Button type="primary" htmlType="submit" className={styles.formButton}>
          保存
        </Button>
        <a href={"/share"}>
          <Button type="primary" className={styles.formButton}>
            取消
          </Button>
        </a>
      </Form.Item>
    </Form>
  );
}


const ShareList = function() {
  let { siteInfo } = useContext(PageContext);
  const columns = [
    {
      title: "名称",
      key: "name",
      render: item => {
        return <a href={`#/edit/${item.id}`}>{item.displayName}</a>;
      }
    },
    {
      title: "类型",
      key: "type",
      dataIndex: "type",
      render: item => {
        return item === "USER" ? "用户" : "组";
      }
    },
    {
      title: "权限",
      key: "permission",
      dataIndex: "permission"
    },
    {
      title: "操作",
      key: "ops",
      render: item => <Popconfirm
        title="你想要删除这条纪录吗?"
        onConfirm={() => {
          deleteShare(item.id).then();
        }}
        okText="是"
        cancelText="否"
      ><Button>删除</Button>
      </Popconfirm>
    }
  ];
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const fetch = useCallback(async () => {
    const dataSource = await getRoleAssignments(siteInfo.siteId);
    setLoading(false);
    setDataSource(dataSource);
  }, [siteInfo.siteId]);

  const deleteShare = async (id) => {
    setLoading(true);
    await deleteRoleAssignments(siteInfo.siteId, [id]);
    await fetch();
  };

  useEffect(() => {
    fetch().then();
  }, [fetch, siteInfo.siteId]);

  return (
    <Card
      title="授权管理"
      bordered={false}
      extra={
        <div className="list_toolbar">
          <a href="#/new">
            <Button type="primary">创建</Button>
          </a>
          <Button type="primary">删除</Button>
        </div>
      }>
      <Spin spinning={loading}>
        <Table dataSource={dataSource} columns={columns} rowKey="name"/>
      </Spin>
    </Card>
  );
};

export default function() {
  return <DefaultLayout>
    <Router>
      <Switch>
        <Route exact path="/">
          <ShareList/>
        </Route>
        <Route path="/:type" exact component={ShareEditForm}/>
        <Route path="/:type/:id" component={ShareEditForm}/>
      </Switch>
    </Router>
  </DefaultLayout>;
};
