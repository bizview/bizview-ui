import React, { useState } from "react";
import { getList } from "../../../../../../service/list_service";
import DefaultLayout from "../../../../../../components/default_layout/default_layout";
import { Button, Col, Form, message, Row, Upload } from "antd";
import FieldRef from "../../../../../../components/page_controls/field_ref";
import { createItem, getItem, updateItem } from "../../../../../../service/listitem_service";
import { UploadOutlined } from "@ant-design/icons";

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 21 }
};

export default function CreateItem({ list, item }) {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    try {
      if (fileList.length <= 0) {
        message.error("请先上传文件!");
        return;
      }
      setLoading(true);
      if (item) {
        values.id = item.id;
        if (fileList.length > 0) {
          values.name = fileList[0].name;
          await updateItem(list.staticName, values, null, null, fileList[0]);
        } else {
          await updateItem(list.staticName, values);
        }
      } else {
        values.name = fileList[0].name;
        await createItem(list.staticName, values, null, fileList[0]);
      }
      message.success("保存成功");
      window.location.href = list.listUrl;
      setLoading(false);
    } catch (e) {
      message.error("保存失败," + e);
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      console.log(file);
      setFileList([file]);
      return false;
    },
    fileList
  };

  return <DefaultLayout>
    <div className={"table-toolbar"}>
      <div className="table-toolbar-title">{list.title} - 创建文档</div>
    </div>
    <div className={"ant-table-wrapper"}>
      <Form layout="vertical" {...layout} onFinish={handleSubmit} grid={{}}>
        {
          list.fields.filter(f => f.fieldType !== "SYSTEM" && f.name !== "name").map(f => {
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
        <Form.Item
          label="上传"
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined/>}>上传</Button>
          </Upload>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
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
  </DefaultLayout>;
}

CreateItem.getInitialProps = async ({ query, req }) => {
  const list = await getList(query.list_id, req.cookies.access_token);
  if (query.id) {
    const item = await getItem(query.list_id, query.id);
    return { list, item };
  } else {
    return { list };
  }
};