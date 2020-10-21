import React, { useEffect, useState } from "react";
import { getAllUsers } from "../service/user_service";
import { Button, Card, Spin, Table, message } from "antd";
import DefaultLayout from "../components/default_layout/default_layout";


export default function() {
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "账号",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name"
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
        message.error(e);
        setLoading(false);
      }
    }

    fetchData().then();
  }, []);

  return <DefaultLayout>
    <Card
      title="组管理"
      bordered={false}
      extra={
        <Button type="primary">创建</Button>
      }>
      <Spin spinning={loading}>
        <Table dataSource={dataSource} columns={columns} rowKey="id"/>
      </Spin>
    </Card>
  </DefaultLayout>;
};