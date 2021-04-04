import React, { useContext } from "react";
import { Divider, Select, Button } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import DefaultLayout from "../default_layout/default_layout";
import { PageContext } from "../../service/util_service";
import { BreadCrumbEvent } from "../global_breadcrumb/global_breadcrumb";
import queryString from "query-string";
import { SystemPermission } from "../../domain/permissions";
import CheckRole from "../user/check_role";


export default function ViewWrapper({ list, view, mapInfo }) {
  const DynamicView = dynamic(() => import(`../views/${view.path}`));
  const { siteInfo } = useContext(PageContext);
  const parentId = queryString.parse(location.search).pid;
  const searchInfo = parentId ? `?pid=${parentId}` : "";
  return <DefaultLayout>
    <BreadCrumbEvent crumbs={[
      { icon: "home", href: `/s/${siteInfo.siteId}`, title: "Home" },
      { href: `/s/${siteInfo.siteId}/l/${list.id}`, title: list.title },
      ...mapInfo ? mapInfo.map(m => ({
        href: `/s/${siteInfo.siteId}/l/${list.id}?pid=${m.id}`,
        title: m.name
      })) : []
    ]}/>
    <div className={"table-toolbar"}>
      <div className="table-toolbar-title">{list.title}</div>
      <div className="table-toolbar-option">
        <CheckRole roles={[SystemPermission.LIST_CONTRIBUTE]}>
          <div className="table-toolbar-item">
            <a href={`${list.listUrl}/f/${list.properties.forms.newForm}${searchInfo}`}><Button
              type={"primary"}><PlusOutlined/>新建</Button></a>
          </div>
          <Divider type="vertical"/>
        </CheckRole>
        <Select style={{ width: "120px" }}
                defaultValue={view.name}
                onChange={p => {
                  window.location.href = `/s/${siteInfo.siteId}/l/${list.id}/v/${p}`;
                }}>
          {
            list.properties.views.map(v => (<Select.Option value={v.name} key={v.name}>{v.title}</Select.Option>))
          }
        </Select>
        <CheckRole roles={[SystemPermission.LIST_EDITOR]}>
        <span className={"table-toolbar-item-icon"} style={{ marginLeft: "6px" }}><a
          href={`${list.listUrl}/list_setting`}><SettingOutlined/></a></span>
        </CheckRole>
      </div>
    </div>
    <div className={"ant-table-wrapper"}>
      <DynamicView list={list} view={view}/>
    </div>
  </DefaultLayout>;
};



