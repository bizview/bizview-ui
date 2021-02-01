import { apiUrl, fetchWithToken } from "./base_service";


export const getItems = async (list, filter) => {
  const response = await fetchWithToken(apiUrl + `/record/${list}/list`, {
    method: "post",
    body: JSON.stringify(filter)
  });
  return await response.json();
};

export const getItemsInFolder = async (list, pid, filter) => {
  const response = await fetchWithToken(apiUrl + `/record/${list}/list/${pid !== undefined ? pid : 0}`, {
    method: "post",
    body: JSON.stringify(filter)
  });
  return await response.json();
};

export const getItem = async (list, id) => {
  const response = await fetchWithToken(apiUrl + `/record/${list}/get/${id}`);
  return await response.json();
};

export const getItemMap = async (list, id) => {
  const response = await fetchWithToken(apiUrl + `/record/${list}/map/${id}`);
  return await response.json();
};

export const createItem = async (list, item, attachments, binary) => {
  const formData = new FormData();
  if (attachments) {
    attachments.forEach(attachment => {
      formData.append("files", attachment);
    });
  }
  if (binary) {
    formData.append("itemBody", binary);
  }
  formData.append("item", JSON.stringify(item));
  const response = await fetchWithToken(apiUrl + `/record/${list}/create`, {
    method: "post",
    body: formData,
    headers: {
      "Content-Type": undefined
    }
  });
  return await response.json();
};

export const updateItem = async (list, item, attachments, deletedAttachments) => {
  const formData = new FormData();
  if (attachments) {
    attachments.forEach(attachment => {
      formData.append("files", attachment);
    });
  }
  if (deletedAttachments) {
    formData.append("deletedFiles", JSON.stringify(deletedAttachments));
  }
  formData.append("item", JSON.stringify(item));
  const response = await fetchWithToken(apiUrl + `/record/${list}/update`, {
    method: "post",
    body: formData,
    headers: {
      "Content-Type": undefined
    }
  });
  return await response.json();
};

export const updatePage = async (list, item) => {
  const response = await fetchWithToken(apiUrl + `/record/${list}/updatePage`, {
    method: "post",
    body: JSON.stringify(item)
  });
  return await response.json();
};

export const deleteItem = async (list, id) => {
  const response = await fetchWithToken(apiUrl + `/record/${list}/delete/${id}`);
  return await response.json();
};

export const createPage = async (list, item) => {
  const response = await fetchWithToken(apiUrl + `/record/${list}/create_page`, {
    method: "post",
    body: JSON.stringify(item)
  });
  return await response.json();
};
