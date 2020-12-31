import React from "react";
import { getList } from "../../../../../../service/list_service";
import ViewWrapper from "../../../../../../components/view_wrapper/view_wrapper";

export default function ListView({ list }) {
  let view = list["properties"]["views"].find(v => v.name === window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1));
  return <ViewWrapper list={list} view={view}/>;
};

ListView.getInitialProps = async ({ query, req, res }) => {
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