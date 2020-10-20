import { getNavigator } from "../../service/site_service"
import { Menu } from "antd"
import React, { useContext, useState, useEffect } from "react"
import { PageContext } from "../../service/util_service"

export default function GlobalNavigator() {
  const [siteLinks, setSiteLinks] = useState([])
  const {siteInfo} = useContext(PageContext)

  useEffect(() => {
    async function fetch() {
      const siteLinks = (await getNavigator(siteInfo.siteId, 1)).links
      setSiteLinks(siteLinks)
    }

    fetch().then()
  }, [siteInfo])

  function getMenu(link) {
    if (link.children && link.children.length > 0) {
      return (
        <Menu.SubMenu key={link.url} title={link.name}>
          {link.children.map(sub => getMenu(sub))}
        </Menu.SubMenu>
      )
    } else {
      return (
        <Menu.Item key={link.url}>
          <a href={link.url}>{link.name}</a>
        </Menu.Item>
      )
    }
  }

  return (
    siteLinks.length > 0 && (
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[`${window.location.pathname}`]}
            style={{ lineHeight: "64px" }}>
        {siteLinks.map(link => getMenu(link))}
      </Menu>
    )
  )
}
