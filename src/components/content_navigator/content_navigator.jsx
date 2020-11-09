import { getNavigator } from "../../service/site_service";
import { Menu } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "../../service/util_service";

const location = typeof window !== "undefined" ? window.location : {};

export default function ContentNavigator() {
  const [siteLinks, setSiteLinks] = useState([]);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState([]);
  const { siteInfo } = useContext(PageContext);

  useEffect(() => {
    const iteratorLink = links => {
      let keys = [];
      links.forEach(link => {
        if (location.pathname.indexOf(link.url) >= 0) {
          keys.push(link.url);
        }
        if (link.children) {
          keys = [...keys, ...iteratorLink(link.children)];
        }
      });
      return keys;
    };

    async function fetch() {
      const siteLinks = (await getNavigator(siteInfo.siteId, 2)).links;
      setSiteLinks(siteLinks);
      setDefaultOpenKeys(iteratorLink(siteLinks));
    }

    fetch().then();
  }, [siteInfo]);


  function getMenu(link) {
    if (link.children && link.children.length > 0) {
      return (
        <Menu.SubMenu key={link.url} title={link.name}>
          {link.children.map(sub => getMenu(sub))}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={link.url}>
          <a href={link.url}>{link.name}</a>
        </Menu.Item>
      );
    }
  }

  return (
    siteLinks.length > 0 && (
      <Menu mode="inline" defaultSelectedKeys={defaultOpenKeys} defaultOpenKeys={["/"]}
            style={{ height: "100%", borderRight: 0 }}>
        {siteLinks.map(link => getMenu(link))}
      </Menu>
    )
  );
}
