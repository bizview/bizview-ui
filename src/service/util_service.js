import { getUserProfile } from "./user_service";
import React from "react";
import { Subject } from "rxjs";

export const replaceUrl = (siteInfo, url) => {
  return url.replace(/~\//s, siteInfo === undefined || siteInfo.siteId === 1 ? "/" : `/s/${siteInfo.siteId}/`);
};

export const uuid = () => {
  // Public Domain/MIT
  let d = new Date().getTime(); //Timestamp
  let d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  // noinspection SpellCheckingInspection
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

function getContext() {
  const location = typeof window !== "undefined" ? window.location : {};
  const url = location.href;
  const regex = /\/s\/(?<sid>\w+)(\/l\/(?<lid>\w+))?(\/i\/(?<iid>\w+))?/;
  const matches = url.match(regex);
  let siteId = 1;
  let listId;
  let itemId;
  if (matches && matches.groups) {
    siteId = matches.groups.sid;
    listId = matches.groups.lid;
    itemId = matches.groups.iid;
  }
  return {
    siteId,
    listId,
    itemId
  };
}

export const PageContext = React.createContext({
  siteInfo: {}
});

export async function getPageState() {
  const user = await getUserProfile();
  return {
    user,
    eventBus: new Subject(),
    siteInfo: getContext()
  };
}