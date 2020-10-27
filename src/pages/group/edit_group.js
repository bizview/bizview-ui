import { Button, Form, Input, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import DefaultLayout from "../../components/default_layout/default_layout";
import queryString from "query-string";
import { getGroup, updateGroup } from "../../service/group_service";

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 }
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 16 }
};

export default function(props) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [group, setGroup] = useState({});


  useEffect(() => {
    async function fetch() {
      const id = queryString.parse(props.location.search).u;
      setGroup(await getGroup(id));
      setLoading(false);
    }

    fetch().then();
  }, [props.location]);

  const onFinish = async values => {
    setSubmitting(true);
    try {
      await updateGroup({
        id: group.id,
        ...values
      });
      message.success("更新成功");
      window.location.href = "/group";
    } catch (e) {
      message.error(`保存失败, ${e.toString()}`);
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = errorInfo => {
    message.error(`保存失败, ${errorInfo.toString()}`);
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
          label="组名"
          name="name"
          initialValue={group.name}
          rules={[{ required: true, message: "请输入组名" }]}
        >
          <Input/>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" loading={submitting} htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>}
    </Spin>
  </DefaultLayout>;
};
