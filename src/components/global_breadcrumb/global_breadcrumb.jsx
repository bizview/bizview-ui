import { Breadcrumb } from "antd";
import React, { useContext } from "react";
import { PageContext, replaceUrl } from "../../service/util_service";
import { siteMap } from "../../domain/site_map";

const getBreadcrumb = (siteInfo) => {
  const rootNode = [];
  matchRoute(siteInfo, siteMap, rootNode);
  return rootNode.reverse();
};

const matchRoute = (siteInfo, nodes, rootNode) => {
  for (const node of nodes) {
    node.href = replaceUrl(siteInfo, node.href);
    if (node.href === window.location.pathname) {
      rootNode.push(node);
      return node;
    } else if (node.children) {
      const subNode = matchRoute(siteInfo, node.children, rootNode);
      if (subNode) {
        rootNode.push(node);
      }
      return node;
    }
  }
};


export default function GlobalBreadcrumb() {
  const { siteInfo } = useContext(PageContext);
  const breadCrumb = getBreadcrumb(siteInfo);
  return <>
    <Breadcrumb style={{ margin: "16px 0", flex: 1 }}>
      {breadCrumb.map(crumb => (
        <Breadcrumb.Item key={crumb.title} href={crumb.href}>
          <span>{crumb.title}</span>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
    <div style={{ marginRight: "5px", display: "flex" }}>
      <a href={replaceUrl(siteInfo, `~/`)}>所有内容</a>
    </div>
  </>;
}