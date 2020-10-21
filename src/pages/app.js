import React, { useContext, useEffect, useState } from "react";
import { createList, getApplication, getApplications } from "../service/list_service";
import { Button, Card, Form, Input, List, Spin } from "antd";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { PageContext } from "../service/util_service";
import DefaultLayout from "../components/default_layout/default_layout";

function Application() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { siteInfo } = useContext(PageContext);

  useEffect(() => {
    async function fetch() {
      const apps = await getApplications(siteInfo.siteId);
      setApps(apps);
      setLoading(false);
    }

    fetch().then();
  }, [siteInfo]);

  return (
    <Card title="应用程序" bordered={false}>
      <Spin spinning={loading}>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={apps}
          renderItem={app => <List.Item>
            <Card
              size={"small"}
              title={app.title}
              extra={
                <a href={`#/create/${app.id}`}>
                  <Button type="primary">创建</Button>
                </a>
              }>
              {app.description}
            </Card>
          </List.Item>}/>
      </Spin>
    </Card>
  );
}

function AppCreator(props) {
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState([]);

  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 }
  };
  const tailLayout = {
    wrapperCol: { offset: 3, span: 21 }
  };
  const handleSubmit = async (values) => {
    await createList({
      siteId: application.siteId,
      templateId: application.id,
      ...values
    });
    window.location.href = "#/";
  };

  useEffect(() => {
    async function fetch() {
      const application = await getApplication(props.match.params.id);
      setApplication(application);
      setLoading(false);
    }

    fetch().then();
  }, [props.match.params.id]);

  return (
    <Spin spinning={loading}>
      <Form {...layout} onFinish={handleSubmit}>
        <Form.Item label="名称" name={"name"} rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item label="显示名" name={"title"} rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item label="描述" name={"description"} rules={[{ required: true }]}>
          <Input.TextArea rows={4}/>
        </Form.Item>
        <Form.Item  {...tailLayout}>
          <Button type="primary" htmlType="submit" className="login-form-button">
            create
          </Button>
          <a href="#/" style={{ marginLeft: "8px" }}>
            <Button type="primary" className="login-form-button">
              cancel
            </Button>
          </a>
        </Form.Item>
      </Form>
    </Spin>
  );
}

export default function() {
  return <DefaultLayout>
    <Router>
      <Switch>
        <Route exact path="/">
          <Application/>
        </Route>
        <Route path="/create/:id" exact component={AppCreator}/>
      </Switch>
    </Router>
  </DefaultLayout>;
};