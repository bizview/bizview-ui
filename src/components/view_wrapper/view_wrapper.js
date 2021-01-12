import React, { useContext } from "react";
import { Divider, Select, Button } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import DefaultLayout from "../default_layout/default_layout";
import { PageContext } from "../../service/util_service";
import { BreadCrumbEvent } from "../global_breadcrumb/global_breadcrumb";


export default function ViewWrapper({ list, view }) {
  const DynamicView = dynamic(() => import(`../views/${view.path}`));
  const { siteInfo } = useContext(PageContext);
  return <DefaultLayout>
    <BreadCrumbEvent crumbs={[
      { icon: "home", href: `/s/${siteInfo.siteId}`, title: "Home" },
      { href: `/s/${siteInfo.siteId}/l/${list.id}`, title: list.title }
    ]}/>
    <div className={"table-toolbar"}>
      <div className="table-toolbar-title">{list.title}</div>
      <div className="table-toolbar-option">
        <div className="table-toolbar-item">
          <a href={`${list.listUrl}/f/${list.properties.forms.newForm}`}><Button
            type={"primary"}><PlusOutlined/>新建</Button></a>
        </div>
        <Divider type="vertical"/>
        <Select style={{ width: "120px" }}
                defaultValue={view.name}
                onChange={p => {
                  window.location.href = `/s/${siteInfo.siteId}/l/${list.id}/v/${p}`;
                }}>
          {
            list.properties.views.map(v => (<Select.Option value={v.name} key={v.name}>{v.title}</Select.Option>))
          }
        </Select>
        <span className={"table-toolbar-item-icon"} style={{ marginLeft: "6px" }}><a
          href={`${list.listUrl}/list_setting`}><SettingOutlined/></a></span>
      </div>
    </div>
    <div className={"ant-table-wrapper"}>
      <DynamicView list={list} view={view}/>
    </div>
  </DefaultLayout>;
};
