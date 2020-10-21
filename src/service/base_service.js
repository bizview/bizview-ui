import { replaceUrl } from "./util_service";

export const host = process.env.GATSBY_API_URL;
export const apiUrl = host + "/api/1.0";

export const fetchWithToken = (url, options = {}) => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = token
      ? {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "bearer " + token
      }
      : {
        Accept: "application/json",
        "Content-Type": "application/json"
      };
    if (options && options.headers && !options.headers["Content-Type"]) {
      delete options.headers["Content-Type"];
    }
    return fetch(url, {
      headers,
      ...options
    }).then(response => {
      if (response.status === 401) {
        if (window.pageInfo) {
          window.location.href = replaceUrl("/401");
          throw new Error("没有权限访问");
        } else {
          throw new Error("没有权限访问");
        }
      } else if (response.status !== 200) {
        throw new Error("操作失败," + response.status);
      }
      return response;
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};
