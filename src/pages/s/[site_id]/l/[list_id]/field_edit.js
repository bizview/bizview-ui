import DefaultLayout from "../../../../../components/default_layout/default_layout";
import React, { useState, createRef, forwardRef, useImperativeHandle } from "react";
import { Button, Card, Divider, Form, Input, message, Modal, Select, Spin, Table, InputNumber, Switch } from "antd";
import { getList, updateListField } from "../../../../../service/list_service";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

function FieldEditForm({ list, onDone }, ref) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [field, setField] = useState({});
  const [form] = Form.useForm();
  const onFinish = async () => {
    const values = await form.validateFields();
    setLoading(true);
    await updateListField(list.id,
      {
        ...field,
        ...values
      }
    );
    message.info("保存成功");
    setVisible(false);
    setLoading(false);
    onDone(list.id);
  };
  useImperativeHandle(ref, () => ({
    setField: async (field) => {
      await setField(field);
      form.resetFields();
      setVisible(true);
    }
  }));

  return <Modal visible={visible} okText="保存" cancelText={"取消"} onCancel={() => {
    setVisible(false);
  }} onOk={onFinish}>
    <Spin spinning={loading}>
      <Form form={form} {...layout}>
        <Form.Item name={"name"} label={"名称"} initialValue={field.name}>
          <Input/>
        </Form.Item>
        <Form.Item name={"dataType"} label={"类型"} initialValue={field.dataType}>
          <Select>
            <Select.Option value={"STRING"}>STRING</Select.Option>
            <Select.Option value={"TEXT"}>TEXT</Select.Option>
            <Select.Option value={"INT"}>INT</Select.Option>
            <Select.Option value={"LONG"}>LONG</Select.Option>
            <Select.Option value={"FLOAT"}>FLOAT</Select.Option>
            <Select.Option value={"BOOLEAN"}>BOOLEAN</Select.Option>
            <Select.Option value={"DATE"}>DATE</Select.Option>
            <Select.Option value={"BYTE"}>BYTE</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name={"length"} label={"长度"} initialValue={field.length}>
          <InputNumber/>
        </Form.Item>
        <Form.Item name={"allowNull"} label={"允许为空"} initialValue={field.allowNull} valuePropName={"checked"}>
          <Switch/>
        </Form.Item>
        <Form.Item name={"props"} label={"Json属性"} initialValue={field.props}>
          <Input.TextArea/>
        </Form.Item>
      </Form>
    </Spin>
  </Modal>;
}

// noinspection JSValidateTypes
FieldEditForm = forwardRef(FieldEditForm);


export default function FieldEdit({ list }) {
  const fieldModalRef = createRef();
  const [fields, setFields] = useState(list.fields);
  const [loading, setLoading] = useState(false);

  function back() {
    location.href = list.listUrl + "/list_setting";
  }

  const columns = [
    { title: "名称", dataIndex: "name" },
    { title: "类型", dataIndex: "dataType" },
    {
      title: "操作", render: (record) => (
        <>
          <Button type={"link"} onClick={() => {
            fieldModalRef.current.setField(record).then();
          }}>编辑</Button><Divider type="vertical"/> <Button type={"link"}>删除</Button>
        </>
      )
    }
  ];

  async function onDone(listId) {
    setLoading(true);
    const list = await getList(listId);
    setFields(list.fields);
    setLoading(false);
  }

  return <DefaultLayout>
    <Spin spinning={loading}>
      <Card title={`${list.title} 字段编辑`}
            extra={<><Button style={{ marginRight: "5px" }} onClick={() => {
              fieldModalRef.current.setField({}).then();
            }}>添加</Button><Button onClick={back}>返回</Button></>}>
        <Table columns={columns} dataSource={fields.filter(o => o.fieldType !== "SYSTEM")} rowKey={"name"}/>
      </Card>
      <FieldEditForm list={list} ref={fieldModalRef} onDone={onDone.bind(this)}/>
    </Spin>
  </DefaultLayout>;
}

FieldEdit.getInitialProps = async ({ query, req }) => {
  const list = await getList(query.list_id, req.cookies.access_token);
  return { list };
};