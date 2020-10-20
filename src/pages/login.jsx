import { UserOutlined, LockOutlined } from "@ant-design/icons"
import React from "react"
import { Form, Input, Button, message } from "antd"
import { login } from "../service/user_service"
import styles from "./login.module.css";

export default function LoginForm() {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  }

  const onFinish = async values => {
    try {
      localStorage.setItem("access_token", (await login(values)).access_token)
      window.location.href = "/"
    } catch (e) {
      message.warn("请检查用户名密码是否正确!, 详细信息:" + e)
    }
  }

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo)
  }

  return <div className={styles.container}>
    <Form className="login-form" {...layout} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }]}>
        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
        <Input prefix={<LockOutlined className="site-form-item-icon"/>} placeholder="Password" type="password"/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  </div>
}
