import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Spin, Table, message, Divider, Popconfirm } from "antd";
import DefaultLayout from "../../../components/default_layout/default_layout";
import { deleteGroup, getGroups } from "../../../service/group_service";
import { BreadCrumbEvent } from "../../../components/global_breadcrumb/global_breadcrumb";
import { PageContext } from "../../../service/util_service";


export default function() {
  let { siteInfo } = useContext(PageContext);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);

  const deleteUserFunc = async (id) => {
    setLoading(true);
    await deleteGroup(id);
    const dataSource = await getGroups();
    setDataSource(dataSource);
    setLoading(false);
    message.success("删除成功");
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "组名",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "操作",
      key: "op",
      render: (record) => {
        return <><a href={`/group/edit_group?u=${record.id}`}>编辑</a><Divider type="vertical"/>
          <Popconfirm
            title="你想要删除这条纪录吗?"
            onConfirm={() => {
              deleteUserFunc(record.id).then();
            }}
            okText="是"
            cancelText="否"
          >
            <Button className={"link-button"}> 删除</Button>
          </Popconfirm>
        </>;
      }
    }
  ];


  useEffect(() => {
    async function fetchData() {
      try {
        const dataSource = await getGroups();
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
    <BreadCrumbEvent crumbs={[
      { icon: "home", href: `/s/${siteInfo.siteId}`, title: "Home" },
      { icon: "home", href: `/s/${siteInfo.siteId}/settings`, title: "网站设置" }
    ]}/>
    <Card
      title="组管理"
      bordered={false}
      extra={
        <a href={"/group/create_group"}> <Button type="primary">创建</Button></a>
      }>
      <Spin spinning={loading}>
        <Table dataSource={dataSource} columns={columns} rowKey="id"/>
      </Spin>
    </Card>
  </DefaultLayout>;
};