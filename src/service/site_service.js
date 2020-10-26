import { apiUrl, fetchWithToken } from "./base_service";

export const getTheme = async () => {
  const response = await fetch("/api/1.0/site/theme");
  return await response.json();
};

export const getViews = async () => {
  const response = await fetchWithToken(apiUrl + "/theme/views");
  return await response.json();
};

export const getLayouts = async () => {
  const response = await fetchWithToken(apiUrl + "/theme/layouts");
  return await response.json();
};

export const getControls = async () => {
  const response = await fetchWithToken(apiUrl + "/theme/controls");
  return await response.json();
};

export const getThemes = async () => {
  const response = await fetchWithToken(apiUrl + "/theme");
  return await response.json();
};

export const setTheme = async (siteId, name) => {
  const response = await fetchWithToken(apiUrl + `/theme/${siteId}/${name}`);
  await response.text();
};

export const getNavigator = async (siteId, type, siteMap) => {
  const response = await fetchWithToken(apiUrl + `/site/${siteId}/navigator/${type}/${siteMap || ""}`);
  return await response.json();
};

export const setSiteNavigator = async navigator => {
  const response = await fetchWithToken(apiUrl + `/site/navigator`, {
    method: "post",
    body: JSON.stringify(navigator)
  });
  return await response.text();
};

export const setWelcomePage = async (siteId, url) => {
  const formData = new FormData();
  formData.append("welcomePage", url);
  const response = await fetchWithToken(apiUrl + `/site/${siteId}/welcome`, {
    method: "post",
    body: formData,
    headers: {
      "Content-Type": undefined
    }
  });
  return await response.text();
};
