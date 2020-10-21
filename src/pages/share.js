import React, { useState, useEffect, useContext } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Form, Button, Select, Checkbox, Spin, Card, Table } from "antd";
import { findUsers } from "../service/user_service";
import {
  findRoleAssignmentById,
  createRoleAssignments,
  deleteRoleAssignments,
  getPermissionGroups,
  getRoleAssignments
} from "../service/share_service";
import { PageContext } from "../service/util_service";
import DefaultLayout from "../components/default_layout/default_layout";

const CheckboxGroup = Checkbox.Group;

function ShareEditForm(props) {
  let { siteInfo } = useContext(PageContext);
  const id = props.match.params.id;
  const [fetching, setFetching] = useState(false);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleAssignment, setRoleAssignment] = useState(null);
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
    await createRoleAssignments(assignments);
    window.location.href = "#/";
  };

  const fetchUser = async name => {
    if (!name) return;
    setFetching(true);
    const users = await findUsers(name);
    const plainUsers = users.map(user => ({
      text: `${user.name}`,
      value: user.id
    }));
    setUsers(plainUsers);
    setFetching(false);
  };

  const deleteRoles = async () => {
    await deleteRoleAssignments([{ id }]);
    window.location.href = "#/";
  };


  useEffect(() => {
    async function fetch() {
      const permissions = await getPermissionGroups();
      if (id) {
        const roleAssignment = await findRoleAssignmentById(id);
        setRoleAssignment(roleAssignment);
      }
      setPermissions(permissions);
    }

    fetch().then();
  }, [id]);
  const disabled = !!id;
  if (id && !roleAssignment) {
    return <Spin/>;
  }
  return (
    <Form onFinish={handleSubmit} initialValues={{
      user: roleAssignment ? [{ label: roleAssignment.user.name, key: roleAssignment.user.id }] : undefined,
      permissions: roleAssignment ? [roleAssignment.permissionGroup.id] : []
    }}>
      <Form.Item name={"user"} label="选择用户" rules={[{ required: true, message: "Please select at lease one user!" }]}>
        <Select disabled={disabled} mode="multiple" labelInValue placeholder="Select users"
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
        <CheckboxGroup disabled={disabled} options={permissions.map(p => ({ label: p.name, value: p.id }))}/>
      </Form.Item>
      <Form.Item>
        {!disabled && (
          <Button type="primary" htmlType="submit" className="login-form-button">
            save
          </Button>
        )}
        {id && (
          <Button type="primary" className="login-form-button" onClick={deleteRoles}>
            delete
          </Button>
        )}
        <Button type="primary" className="login-form-button">
          cancel
        </Button>
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
        return <a href={`#/edit/${item.id}`}>{item.user.name}</a>;
      }
    },
    {
      title: "类型",
      key: "type",
      render: item => {
        return item.user ? "用户" : "组";
      }
    },
    {
      title: "权限",
      key: "permissionName",
      render: r => r.permissionGroup.name
    }
  ];
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);


  useEffect(() => {
    async function fetch() {
      const dataSource = await getRoleAssignments(siteInfo.siteId);
      setLoading(false);
      setDataSource(dataSource);
    }

    fetch().then();
  }, [siteInfo.siteId]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name
    })
  };

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
        <Table rowSelection={rowSelection} dataSource={dataSource} columns={columns} rowKey="id"/>
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
