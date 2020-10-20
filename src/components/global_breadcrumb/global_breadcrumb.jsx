import { Breadcrumb } from "antd"
import React, { useContext } from "react"
import { PageContext } from "../../service/util_service"

export default function GlobalBreadcrumb() {
  const { siteInfo } = useContext(PageContext)
  return <>
    <Breadcrumb style={{ margin: "16px 0", flex: 1 }}>

    </Breadcrumb>
    <div style={{ marginRight: "5px", display: "flex" }}>
      <a href={`/s/${siteInfo.siteId}`}>所有内容</a>
    </div>
  </>
}