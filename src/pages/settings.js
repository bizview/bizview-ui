import DefaultLayout from "../components/default_layout/default_layout";
import React, { useContext } from "react";
import { Card } from "antd";
import { siteMap } from "../domain/site_map";
import { PageContext, replaceUrl } from "../service/util_service";



export default function Settings() {
  let { siteInfo } = useContext(PageContext);

  return (
    <DefaultLayout>
      <Card title="系统设置" bordered={false}>
        <ul>
          {siteMap[0].children[0].children.map(m => (
            <li key={m.title}>
              <a href={replaceUrl(siteInfo, m.href)}>{m.title}</a>
            </li>
          ))}
        </ul>
      </Card>
    </DefaultLayout>
  );
};

