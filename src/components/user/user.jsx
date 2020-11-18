import { Avatar, Dropdown, Menu } from "antd";
import React, { useContext } from "react";
import { PageContext, replaceUrl } from "../../service/util_service";

const location = typeof window !== "undefined" ? window.location : {};
export default function User() {
  let { user, siteInfo } = useContext(PageContext);

  const menu = (
    <Menu style={{ minWidth: "160px" }}>
      <Menu.Item>
        <a rel="noopener noreferrer" href={`/s/${siteInfo.siteId}/settings`}>
          系统设置
        </a>
      </Menu.Item>
      <Menu.Item>
        <button className={"link-button"} style={{ width: "100%" }}
                onClick={() => {
                  localStorage.clear();
                  location.href = "/login";
                }}>
          退出登录
        </button>
      </Menu.Item>
    </Menu>
  );

  return <>
    {user && user.id > 0 ? (
      <Dropdown overlay={menu} placement="bottomRight">
        <Avatar style={{ backgroundColor: "#87d068" }}>{user.username[0]}</Avatar>
      </Dropdown>
    ) : (
      <a href={"/login"}>登录</a>
    )}
  </>;
}