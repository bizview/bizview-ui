import React from "react";
import { Layout } from "antd";
import ContentNavigator from "../content_navigator/content_navigator";
import User from "../user/user";
import GlobalBreadcrumb from "../global_breadcrumb/global_breadcrumb";
import GlobalNavigator from "../global_navigator/global_navigator";

const { Header, Sider, Content } = Layout;

export default function DefaultLayout(props) {
  return <Layout>
    <Header className="header">
      <div className="logo"/>
      <GlobalNavigator/>
      <div className="global-header-index-right">
        <User/>
      </div>
    </Header>
    <Layout>
      <Sider width={200} style={{ background: "#fff" }}>
        <ContentNavigator/>
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <GlobalBreadcrumb/>
        </div>
        <Content
          className={"main-content-layout"}
          style={{
            margin: 0
          }}>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  </Layout>;
}