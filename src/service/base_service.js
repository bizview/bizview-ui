import Cookies from "js-cookie";

export const apiUrl = `${process.env.NEXT_PUBLIC_API_HOST}/api/1.0`;

export const fetchWithToken = (url, options = {}, accessToken, res) => {
  try {
    const token = accessToken ?? Cookies.get("access_token");
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
      if (res) {
        switch (response.status) {
          case 401:
            res.writeHead(301, {
              Location: "/login"
            });
            res.end();
            return;
          case 404:
            res.writeHead(301, {
              Location: "/404"
            });
            res.end();
            return;
          default:
            return response;
        }
      } else {
        if (response.status === 401) {
          Cookies.remove("access_token");
          location.href = "/401";
          throw new Error("没有权限访问");
        } else if (response.status !== 200) {
          throw new Error("操作失败," + response.status);
        }
        return response;
      }
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};
