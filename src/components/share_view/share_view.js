import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Checkbox, Form, message, Popconfirm, Select, Spin, Table } from "antd";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { PageContext } from "../../service/util_service";
import { findUsersAndGroups } from "../../service/user_service";
import styles from "../../pages/share.module.css";
import { getRoleAssignmentsByListId } from "../../service/share_service";

const CheckboxGroup = Checkbox.Group;

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 }
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 16 }
};

export const ShareList = function({ title, roleAssignments, deleteShare }) {
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
          deleteShare(item.id).then(() => {
            location.reload();
          });
        }}
        okText="是"
        cancelText="否"
      ><Button>删除</Button>
      </Popconfirm>
    }
  ];

  return (
    <Card
      title={`${title} 授权管理`}
      bordered={false}
      extra={
        <div className="list_toolbar">
          <a href="#/new">
            <Button type="primary">创建</Button>
          </a>
        </div>
      }>
      <Table dataSource={roleAssignments} columns={columns} rowKey="name"/>
    </Card>
  );
};

function ShareEditForm({ id, createRoleAssignments, roleAssignments, permissions }) {
  let { siteInfo } = useContext(PageContext);
  const [fetching, setFetching] = useState(false);
  const [users, setUsers] = useState([]);
  const currentRoleAssignment = id && roleAssignments.find(r => r.id === parseInt(id));
  const handleSubmit = async (values) => {
    const assignments = [];
    values.user.forEach(u => {
      values.permissions.forEach(p => {
        assignments.push({
          siteId: siteInfo.siteId,
          listId: siteInfo.listId,
          itemId: siteInfo.itemId,
          user: { id: u.key },
          permissionGroup: {
            id: p
          }
        });
      });
    });
    await createRoleAssignments(assignments);
    location.href = "#/";
    location.reload();
  };

  async function fetchUser(name) {
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
  }

  return (
    <Form onFinish={handleSubmit} {...layout} initialValues={{
      user: currentRoleAssignment && [{
        label: currentRoleAssignment.name,
        key: currentRoleAssignment.id
      }],
      permissions: currentRoleAssignment && permissions.filter(p => currentRoleAssignment.permission.split(",").indexOf(p.name) >= 0).map(p => p.id)
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
        <a href={"#/"}>
          <Button type="primary" className={styles.formButton}>
            取消
          </Button>
        </a>
      </Form.Item>
    </Form>
  );
}

export default function ShareViewRoute(props) {
  return <Router>
    <Switch>
      <Route exact path="/" render={(routeProps) => {
        return <ShareList {...props} {...routeProps}/>;
      }}>
      </Route>
      <Route path="/:type" exact render={(routeProps) => {
        return <ShareEditForm history={routeProps.history} {...props}/>;
      }}/>
      <Route path="/:type/:id" render={(routeProps) => {
        return <ShareEditForm history={routeProps.history} id={routeProps.match.params.id} {...props}/>;
      }}/>
    </Switch>
  </Router>;
}