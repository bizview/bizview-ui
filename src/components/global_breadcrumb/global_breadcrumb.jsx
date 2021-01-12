import { Breadcrumb } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "../../service/util_service";
import MenuBar from "../menu_bar/menu_bar";
import { filter } from "rxjs/operators";
import { ComponentMessage, MessageType } from "../../domain/component_message";

export default function GlobalBreadcrumb() {
  const { siteInfo, eventBus } = useContext(PageContext);
  const [breadCrumb, setBreadCrumb] = useState([]);
  eventBus.pipe(filter(m => m.type === MessageType.crumb)).subscribe(({ message }) => {
    setBreadCrumb(message);
  });
  return <>
    <Breadcrumb style={{ margin: "16px 0", flex: 1 }}>
      {breadCrumb.map(crumb => (
        <Breadcrumb.Item key={crumb.title} href={crumb.noHref ? "#" : crumb.href}>
          <span>{crumb.title}</span>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
    <div style={{ marginRight: "5px", display: "flex", alignItems: "center" }}>
      <MenuBar/>
      <a href={`/s/${siteInfo.siteId}`}>所有内容</a>
    </div>
  </>;
}


/**
 * @return {null}
 */
export function BreadCrumbEvent({crumbs}) {
  let { siteInfo, eventBus } = useContext(PageContext);
  useEffect(() => {
    eventBus.next(new ComponentMessage(MessageType.crumb, crumbs));
  }, [siteInfo]);
  return null;
}