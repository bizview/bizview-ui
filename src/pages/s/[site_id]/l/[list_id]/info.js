import DefaultLayout from "../../../../../components/default_layout/default_layout";
import React, { useContext, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { getList, saveList } from "../../../../../service/list_service";
import { BreadCrumbEvent } from "../../../../../components/global_breadcrumb/global_breadcrumb";
import { PageContext } from "../../../../../service/util_service";

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 }
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 16 }
};
export default function ListInfoEdit({ list }) {
  const { siteInfo } = useContext(PageContext);
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    setLoading(true);
    await saveList({
      id: list.id,
      ...values
    });
    message.info("保存成功");
    setLoading(false);
  };

  function back() {
    location.href = list.listUrl + "/list_setting";
  }

  return <DefaultLayout>
    <BreadCrumbEvent crumbs={[
      { icon: "home", href: `/s/${siteInfo.siteId}`, title: "Home" },
      { href: `/s/${siteInfo.siteId}/l/${list.id}`, title: list.title },
      { href: `/s/${siteInfo.siteId}/l/${list.id}/list_setting`, title: "列表设置" }
    ]}/>
    <Form onFinish={onFinish} {...layout}>
      <Form.Item name={"title"} label={"名称"} initialValue={list.title}>
        <Input/>
      </Form.Item>
      <Form.Item  {...tailLayout}>
        <Button style={{ marginRight: "5px" }} htmlType="submit" loading={loading}>保存</Button>
        <Button onClick={back}>返回</Button>
      </Form.Item>
    </Form>
  </DefaultLayout>;
}

ListInfoEdit.getInitialProps = async ({ query, req }) => {
  const list = await getList(query.list_id, req.cookies.access_token);
  return { list };
};