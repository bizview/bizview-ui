import { Button, Checkbox, Form, Input, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import DefaultLayout from "../../components/default_layout/default_layout";
import { getUser, updateUser } from "../../service/user_service";
import queryString from "query-string";

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 }
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 16 }
};

const location = typeof window !== "undefined" ? window.location : {};

export default function(props) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState({});
  const [passwordSet, setPasswordSet] = useState(false);


  useEffect(() => {
    async function fetch() {
      const id = queryString.parse(props.location.search).u;
      setUser(await getUser(id));
      setLoading(false);
    }

    fetch().then();
  }, [props.location]);

  const onFinish = async values => {
    setSubmitting(true);
    try {
      await updateUser({
        id: user.id,
        ...values
      });
      message.success("更新成功");
      location.href = "/user";
    } catch (e) {
      message.error(`创建用户失败, ${e.toString()}`);
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = errorInfo => {
    message.error(`创建用户失败, ${errorInfo.toString()}`);
  };

  return <DefaultLayout>
    <Spin spinning={loading}>
      {!loading && <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="name"
          initialValue={user.name}
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="显示名"
          name="username"
          initialValue={user.username}
          rules={[{ required: true, message: "请输入显示名" }]}
        >
          <Input/>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Checkbox checked={passwordSet} onChange={e => {
            setPasswordSet(e.target.checked);
          }}>修改密码</Checkbox>
        </Form.Item>

        {passwordSet && <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password/>
        </Form.Item>}

        <Form.Item {...tailLayout}>
          <Button type="primary" loading={submitting} htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>}
    </Spin>
  </DefaultLayout>;
};
