import React from "react";
import { getList } from "../../../../../service/list_service";
import ViewWrapper from "../../../../../components/view_wrapper/view_wrapper";
import { getItemMap } from "../../../../../service/listitem_service";


export default function DefaultView({ list, mapInfo }) {
  const view = list["properties"]["views"].find(v => v.name === list.properties.defaultView);
  return <ViewWrapper list={list} view={view} mapInfo={mapInfo}/>;
};

DefaultView.getInitialProps = async ({ query, req, res }) => {
  try {
    const list = await getList(query.list_id, req.cookies.access_token, res);
    if (query.pid) {
      const mapInfo = await getItemMap(query.list_id, query.pid, req.cookies.access_token, res);
      return { list, mapInfo };
    } else {
      return { list };
    }
  } catch (e) {
    console.log(e);
  }
};