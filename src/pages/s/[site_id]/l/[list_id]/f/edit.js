import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "../../../../../../service/util_service";
import { getList } from "../../../../../../service/list_service";
import DefaultLayout from "../../../../../../components/default_layout/default_layout";
import { Button, Col, Form, Input, message, Row, Select, Spin } from "antd";
import FieldRef from "../../../../../../components/page_controls/field_ref";
import { createItem, createPage, getItem, updateItem } from "../../../../../../service/listitem_service";
import queryString from "query-string";

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 21 }
};

export default function EditItem() {
  const itemId = queryString.parse(location.search).id;
  const { siteInfo } = useContext(PageContext);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({
    properties: {
      views: []
    }
  });
  useEffect(() => {
    const fetch = async () => {
      const itemInfo = await getItem(siteInfo.listId, itemId);
      setItem(itemInfo);
      setLoading(false);
    };
    fetch().then();
  }, []);

  const handleSubmit = async (values) => {
    try {
      await updateItem(item.list.staticName, {
        id: item.id,
        ...values
      });
      message.success("保存成功");
      window.location.href = item.list.listUrl;
    } catch (e) {
      message.error("保存失败," + e);
    }
  };

  return <DefaultLayout>
    {loading ? <Spin/> : <>
      <div className={"table-toolbar"}>
        <div className="table-toolbar-title">{item.list.title} - 编辑项目</div>
      </div>
      <div className={"ant-table-wrapper"}>
        <Form layout="vertical" {...layout} onFinish={handleSubmit} grid={{}}>
          {
            item.list.fields.filter(f => f.fieldType !== "SYSTEM").map(f => {
              return <Row gutter={16} key={f.name}>
                <Col span={6}>
                  <label>{f.title}</label>
                </Col>
                <Col span={18}>
                  <FieldRef fieldName={f.name} item={item} edit={true}/>
                </Col>
              </Row>;
            })
          }
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <a href={item.list.listUrl} style={{ marginLeft: "8px" }}>
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