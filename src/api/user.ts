import userRoutes from "../endpoints/userEndPoint";
import Api from "./axiosConfig";

type InventoryItem = {
  id: number;
  name: string;
  description: string;
  quantity: number | null;
  price: number | null;
};

type Customer = {
  _id: string;
  name: string;
  address: string;
  mobileNumber: string;
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
  _id: string;
  updatedItem: Omit<InventoryItem, "id">;
}) => {
  try {
    const response = await Api.patch(userRoutes.updateInventory, data);
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
export const deleteInventoryItem = async (data: { id: string }) => {
  try {
    const response = await Api.patch(userRoutes.deleteInventory, data);
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
export const getInventoryItems = async (page: number, search: string) => {
  try {
    let url = `${userRoutes.getInventory}/${page}`;
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    const response = await Api.get(url);

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
export const createCustomer = async (item: Omit<Customer, "_id">) => {
  try {
    const response = await Api.post(userRoutes.createCustomer, item);
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
export const updateCustomer = async (data: {
  _id: string;
  updatedCustomer: Omit<Customer, "_id">;
}) => {
  try {
    const response = await Api.patch(userRoutes.updateCustomer, data);
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
export const deleteCustomer = async (data: { id: string }) => {
  try {
    const response = await Api.patch(userRoutes.deleteCustomer, data);
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
export const getCustomers = async (page: number, search: string) => {
  try {
    let url = `${userRoutes.getCustomers}/${page}`;
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    const response = await Api.get(url);

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
