import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "../../../../../../service/util_service";
import { getList } from "../../../../../../service/list_service";
import DefaultLayout from "../../../../../../components/default_layout/default_layout";
import { Button, Col, Form, Input, message, Row, Select, Spin } from "antd";
import FieldRef from "../../../../../../components/page_controls/field_ref";
import { createItem, createPage } from "../../../../../../service/listitem_service";

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 21 }
};

export default function CreateItem() {
  const { siteInfo } = useContext(PageContext);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({
    properties: {
      views: []
    }
  });
  useEffect(() => {
    const fetch = async () => {
      const list = await getList(siteInfo.listId);
      setList(list);
      setLoading(false);
    };
    fetch().then();
  }, []);

  const handleSubmit = async (values) => {
    try {
      await createItem(list.staticName, values);
      message.success("保存成功");
      window.location.href = list.listUrl;
    } catch (e) {
      message.error("保存失败," + e);
    }
  };

  return <DefaultLayout>
    {loading ? <Spin/> : <>
      <div className={"table-toolbar"}>
        <div className="table-toolbar-title">{list.title} - 创建项目</div>
      </div>
      <div className={"ant-table-wrapper"}>
        <Form layout="vertical" {...layout} onFinish={handleSubmit} grid={{}}>
          {
            list.fields.filter(f => f.fieldType !== "SYSTEM").map(f => {
              return <Row gutter={16} key={f.name}>
                <Col span={6}>
                  <label>{f.title}</label>
                </Col>
                <Col span={18}>
                  <FieldRef fieldName={f.name} item={
                    {
                      list
                    }
                  } edit={true}/>
                </Col>
              </Row>;
            })
          }
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <a href={list.listUrl} style={{ marginLeft: "8px" }}>
              <Button type="primary">
                取消
              </Button>
            </a>
          </Form.Item>
        </Form>
      </div>
    </>}
  </DefaultLayout>;
}