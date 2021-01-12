import React, { useContext, useState } from "react";
import DefaultLayout from "../../../../../components/default_layout/default_layout";
import { Button, Card, Popconfirm, message } from "antd";
import { deleteList, getList } from "../../../../../service/list_service";
import { PageContext } from "../../../../../service/util_service";
import { BreadCrumbEvent } from "../../../../../components/global_breadcrumb/global_breadcrumb";

export default function ListSetting({ list }) {
  const { siteInfo } = useContext(PageContext);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    await deleteList(list.id);
    message.info("删除成功");
    setLoading(false);
    location.href = `/s/${siteInfo.siteId}`;
  };

  return <DefaultLayout>
    <BreadCrumbEvent crumbs={[
      { icon: "home", href: `/s/${siteInfo.siteId}`, title: "Home" },
      { href: `/s/${siteInfo.siteId}/l/${list.id}`, title: list.title }
    ]}/>
    <Card title={`${list.title} 列表设置`} extra={<Popconfirm
      title="你想要删除列表吗?"
      onConfirm={onDelete}
      okText="是"
      cancelText="否"
    >
      <Button type={"link"} loading={loading}>删除列表</Button>
    </Popconfirm>}>
      <ul>
        <li>
          <a href={"info"}>基本信息</a>
        </li>
        <li>
          <a href={"field_edit"}>修改字段</a>
        </li>
        <li>
          <a href={"share"}>共享</a>
        </li>
        <li>
          <a href={"view_list"}>视图管理</a>
        </li>
      </ul>
    </Card>
  </DefaultLayout>;
}

ListSetting.getInitialProps = async ({ query, req }) => {
  const list = await getList(query.list_id, req.cookies.access_token);
  return { list };
};