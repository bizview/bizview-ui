import { apiUrl, fetchWithToken } from "./base_service";

export const getLists = async (siteId) => {
  const response = await fetchWithToken(apiUrl + "/list/site/" + siteId);
  return await response.json();
};

export const getApplications = async (siteId) => {
  const response = await fetchWithToken(apiUrl + "/app/site/" + siteId);
  return await response.json();
};

export const getApplication = async id => {
  const response = await fetchWithToken(apiUrl + "/app/" + id);
  return await response.json();
};

export const createList = async list => {
  const response = await fetchWithToken(apiUrl + "/list", {
    method: "post",
    body: JSON.stringify(list)
  });
  return await response.json();
};

export const getList = async (id, token) => {
  const response = await fetchWithToken(apiUrl + `/list/${id}`, {}, token);
  return await response.json();
};

export const saveList = async list => {
  const response = await fetchWithToken(apiUrl + `/list/`, {
    method: "put",
    body: JSON.stringify(list)
  });
  return await response.text();
};

export const updateListFields = async (listId, fields) => {
  const response = await fetchWithToken(apiUrl + `/list/${listId}/update_fields`, {
    method: "post",
    body: JSON.stringify(fields)
  });
  return await response.text();
};

export const updateListField = async (listId, field) => {
  const response = await fetchWithToken(apiUrl + `/list/${listId}/update_field`, {
    method: "post",
    body: JSON.stringify(field)
  });
  return await response.text();
};

export const deleteList = async id => {
  const response = await fetchWithToken(apiUrl + `/list/${id}`, {
    method: "delete"
  });
  return await response.text();
};