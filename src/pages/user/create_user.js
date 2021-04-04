import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import DefaultLayout from "../../components/default_layout/default_layout";
import { createUser } from "../../service/user_service";

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 }
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 16 }
};

const location = typeof window !== "undefined" ? window.location : {};

export default function CreateUser() {
  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    setLoading(true);
    try {
      await createUser(values);
      message.success("创建成功");
      location.href = "/user";
    } catch (e) {
      message.error(`创建用户失败, ${e.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = errorInfo => {
    message.error(`创建用户失败, ${errorInfo.toString()}`);
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
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="显示名"
        name="name"
        rules={[{ required: true, message: "请输入显示名" }]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" loading={loading} htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  </DefaultLayout>;
};
