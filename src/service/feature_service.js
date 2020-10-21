import { apiUrl, fetchWithToken } from "./base_service";

export const getFeatures = async (siteId) => {
  const response = await fetchWithToken(apiUrl + "/feature/" + siteId);
  return await response.json();
};

export const setEnable = async (siteId, name, enable) => {
  const response = await fetchWithToken(`${apiUrl}/feature/${siteId}/${name}/${enable}`);
  return (await response.text()) === "true";
};
