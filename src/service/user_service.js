import { encode } from "base-64";
import { apiUrl, fetchWithToken } from "./base_service";

export const login = async values => {
  let headers = new Headers();
  headers.append("Authorization", "Basic " + encode("testjwtclientid:XY7kmzoNzl100"));

  const formData = new FormData();
  formData.append("username", values.username);
  formData.append("password", values.password);
  formData.append("grant_type", "password");
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/oauth/token`, {
    method: "post",
    headers,
    body: formData
  });
  if (response.status !== 200) {
    throw await response.text();
  }
  return await response.json();
};

export const getUserProfile = async () => {
  try {
    const response = await fetchWithToken(apiUrl + "/1/user/currentUser");
    return await response.json();
  } catch (e) {
    localStorage.clear();
    const response = await fetch(apiUrl + "/1/user/currentUser");
    return await response.json();
  }
};

export const getAllUsers = async () => {
  const response = await fetchWithToken(apiUrl + "/1/user/users");
  return await response.json();
};

export const findUsers = async name => {
  const response = await fetchWithToken(apiUrl + "/1/user/find/" + name);
  return await response.json();
};

export const findUsersAndGroups = async name => {
  const response = await fetchWithToken(apiUrl + "/1/user/findAll/" + name);
  return await response.json();
};

export const createUser = async user => {
  const response = await fetchWithToken(apiUrl + "/1/user", {
    method: "post",
    body: JSON.stringify(user)
  });
  return await response.json();
};

export const getUser = async id => {
  const response = await fetchWithToken(apiUrl + `/1/user/get/${id}`);
  return await response.json();
};

export const updateUser = async user => {
  const op = user.password ? "update_set_password" : "update";
  const response = await fetchWithToken(apiUrl + `/1/user/${op}`, {
    method: "put",
    body: JSON.stringify(user)
  });
  return await response.json();
};

export const deleteUser = async id => {
  await fetchWithToken(apiUrl + "/1/user/delete/" + id, {
    method: "delete"
  });
};

export const resetPassword = async user => {
  const response = await fetchWithToken(apiUrl + "/1/user/delete/" + user.id, {
    method: "put",
    body: user
  });
  return await response.json();
};
