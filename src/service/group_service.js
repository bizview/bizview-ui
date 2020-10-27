import { apiUrl, fetchWithToken } from "./base_service";


export const getGroups = async () => {
  const response = await fetchWithToken(apiUrl + "/group/groups");
  return await response.json();
};

export const createGroup = async g => {
  const response = await fetchWithToken(apiUrl + "/group", {
    method: "post",
    body: JSON.stringify(g)
  });
  return await response.json();
};

export const getGroup = async id => {
  const response = await fetchWithToken(apiUrl + `/group/get/${id}`);
  return await response.json();
};

export const updateGroup = async g => {
  const response = await fetchWithToken(apiUrl + `/group/update`, {
    method: "put",
    body: JSON.stringify(g)
  });
  return await response.json();
};

export const deleteGroup = async id => {
  await fetchWithToken(apiUrl + "/group/delete/" + id, {
    method: "delete"
  });
};
