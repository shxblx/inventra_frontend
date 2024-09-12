import userRoutes from "../endpoints/userEndPoint";
import Api from "./axiosConfig";

type InventoryItem = {
  id: number;
  name: string;
  description: string;
  quantity: number | null;
  price: number | null;
};

export const login = async (data: { username: string; password: string }) => {
  try {
    const response = await Api.post(userRoutes.login, data);

    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};
export const createInventoryItem = async (item: Omit<InventoryItem, "id">) => {
  try {
    const response = await Api.post(userRoutes.createInventory, item);
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};
export const updateInventoryItem = async (data: {
  _id: number;
  updatedItem: Omit<InventoryItem, "id">;
}) => {
  try {
    const response = await Api.post(userRoutes.updateInventory, data);

    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};
export const deleteInventoryItem = async (data: { id: number }) => {
  try {
    const response = await Api.post(userRoutes.deleteInventory, data);

    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};
export const getInventoryItems = async (data: {
  page: number;
  search: string;
}) => {
  try {
    const url = `${userRoutes}/${data}`;
    const response = await Api.post(url);

    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};
