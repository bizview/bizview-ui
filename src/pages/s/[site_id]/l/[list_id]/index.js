import React, { useEffect, useState, useContext } from "react";
import { Divider, Select, Spin, Table, Button } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { PageContext } from "../../../../../service/util_service";
import { getList } from "../../../../../service/list_service";
import DefaultLayout from "../../../../../components/default_layout/default_layout";
import dynamic from "next/dynamic";


export default function DefaultView() {
  const { siteInfo } = useContext(PageContext);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({
    properties: {
      views: []
    }
  });
  const [view, setView] = useState({
    name: "默认视图"
  });
  const DynamicView = dynamic(() => import(`../../../../../components/views/${view.path}`));
  useEffect(() => {
    const fetch = async () => {
      const list = await getList(siteInfo.listId);
      let view = list["properties"]["views"].find(v => v.name === window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1));
      if (!view) {
        view = list["properties"]["views"].find(v => v.defaultView);
      }
      setView(view);
      setList(list);
      setLoading(false);
    };
    fetch().then();
  }, []);

  // noinspection JSUnresolvedVariable
  return loading ? <Spin/> : <DefaultLayout>
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
                  window.location.href = p;
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