import React, { useContext, useEffect, useState } from "react";
import { Card, List, Spin } from "antd";
import DefaultLayout from "../../../components/default_layout/default_layout";
import { getLists } from "../../../service/list_service";
import { PageContext } from "../../../service/util_service";
import { BreadCrumbEvent } from "../../../components/global_breadcrumb/global_breadcrumb";

export default function SiteIndex() {
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);
  let { siteInfo } = useContext(PageContext);

  useEffect(() => {
    async function fetch() {
      const lists = await getLists(siteInfo.siteId);
      setLists(lists);
      setLoading(false);
    }

    fetch().then();
  }, [siteInfo]);

  return (
    <DefaultLayout>
      <BreadCrumbEvent crumbs={[
        { icon: "home", href: "/", title: "Home" }
      ]}/>
      <Card title="所有内容" bordered={false}>
        <Spin spinning={loading}>
          <List
            grid={{
              gutter: 16,
              column: 4
            }}
            dataSource={lists}
            renderItem={list => (
              <List.Item key={list.name}>
                <Card
                  title={
                    <a href={`${list.listUrl}`}>
                      <span>{list.title}</span>
                    </a>
                  }>
                  <div style={{ fontSize: "12px", height: "60px" }}>{list.description}</div>
                </Card>
              </List.Item>
            )}/>
        </Spin>
      </Card>
    </DefaultLayout>
  );
};
