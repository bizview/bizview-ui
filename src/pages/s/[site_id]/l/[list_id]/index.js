import React from "react";
import { getList } from "../../../../../service/list_service";
import ViewWrapper from "../../../../../components/view_wrapper/view_wrapper";


export default function DefaultView({ list }) {

  const view = list["properties"]["views"].find(v => v.name === list.properties.defaultView);
  return <ViewWrapper list={list} view={view}/>;
};

DefaultView.getInitialProps = async ({ query, req, res }) => {
  try {
    const list = await getList(query.list_id, req.cookies.access_token);
    return { list };
  } catch (e) {
    res.writeHead(301, {
      Location: "/login"
    });
    res.end();
  }
};