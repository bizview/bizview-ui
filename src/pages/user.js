import React, { useEffect, useState } from "react";
import { getAllUsers } from "../service/user_service";
import { Button, Card, Spin, Table, message, Divider } from "antd";
import DefaultLayout from "../components/default_layout/default_layout";

export default function() {
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "姓名",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "账号",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "操作",
      key: "op",
      render: (record) => {
        return <><a href={`/user/edit_user?u=${record.id}`}>编辑</a><Divider type="vertical"/><Button
          className={"link-button"}>删除</Button></>;
      }
    }
  ];

  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const dataSource = await getAllUsers();
        setLoading(false);
        setDataSource(dataSource);
      } catch (e) {
        message.error(e.toString());
        setLoading(false);
      }
    }

    fetchData().then();
  }, []);

  return <DefaultLayout>
    <Card
      title="用户管理"
      bordered={false}
      extra={
        <a href={"/user/create_user"}>创建</a>
      }>
      <Spin spinning={loading}>
        <Table dataSource={dataSource} columns={columns} rowKey="id"/>
      </Spin>
    </Card>
  </DefaultLayout>;
}