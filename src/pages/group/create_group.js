import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import DefaultLayout from "../../components/default_layout/default_layout";
import { createGroup } from "../../service/group_service";

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 }
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 16 }
};

export default function() {
  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    setLoading(true);
    try {
      await createGroup(values);
      message.success("创建成功");
      window.location.href = "/group";
    } catch (e) {
      message.error(`创建组失败, ${e.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = errorInfo => {
    message.error(`创建组失败, ${errorInfo.toString()}`);
  };

  return <DefaultLayout>
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="组名"
        name="name"
        rules={[{ required: true, message: "组名" }]}
      >
        <Input/>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" loading={loading} htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  </DefaultLayout>;
};
