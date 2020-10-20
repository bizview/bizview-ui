import { apiUrl, fetchWithToken } from "./base_service";

export const getRoleAssignments = async siteId => {
  const response = await fetchWithToken(apiUrl + "/roleassignment/query/" + siteId);
  return await response.json();
};

export const getPermissions = async () => {
  const response = await fetchWithToken(apiUrl + "/roleassignment/permissions");
  return await response.json();
};

export const findRoleAssignmentById = async id => {
  const response = await fetchWithToken(apiUrl + `/roleassignment/${id}`);
  return await response.json();
};

export const createRoleAssignments = async roleAssignments => {
  const response = await fetchWithToken(apiUrl + "/roleassignment", {
    method: "post",
    body: JSON.stringify(roleAssignments)
  });
  return await response.json();
};

export const updateRoleAssignments = async roleAssignments => {
  const response = await fetchWithToken(apiUrl + "/roleassignment", {
    method: "put",
    body: JSON.stringify(roleAssignments)
  });
  return await response.text();
};

export const deleteRoleAssignments = async roleAssignments => {
  const response = await fetchWithToken(apiUrl + "/roleassignment", {
    method: "delete",
    body: JSON.stringify(roleAssignments)
  });
  return await response.text();
};

export const getPermissionGroups = async _ => {
  const response = await fetchWithToken(apiUrl + `/permissiongroup`);
  return await response.json();
};
