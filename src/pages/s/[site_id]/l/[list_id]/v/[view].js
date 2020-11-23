import React, { useEffect, useState } from "react";
import { Divider, Select, Spin, Table, Button } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import DefaultLayout from "../../../../../../components/default_layout/default_layout";
import { getList } from "../../../../../../service/list_service";


export default function ListView({ list, view }) {
  const DynamicView = dynamic(() => import(`../../../../../../components/views/${view.path}`));

  return <DefaultLayout>
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

ListView.getInitialProps = async ({ query, req }) => {
  const list = await getList(query.list_id, req.cookies.access_token);
  return { list, view: {} };
};