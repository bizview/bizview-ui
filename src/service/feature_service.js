import { apiUrl, fetchWithToken } from "./base_service";
export const getFeatures = async () => {
  const response = await fetchWithToken(apiUrl + "/feature/" + window.pageInfo.site.id);
  return await response.json();
};

export const setEnable = async (name, enable) => {
  const response = await fetchWithToken(`${apiUrl}/feature/${window.pageInfo.site.id}/${name}/${enable}`);
  return (await response.text()) === "true";
};
