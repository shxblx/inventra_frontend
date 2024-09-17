import userRoutes from "../endpoints/userEndPoint";
import Api from "./axiosConfig";

type InventoryItem = {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  unit: "kg" | "litre" | "nos";
};

type Customer = {
  _id: string;
  name: string;
  address: string;
  mobileNumber: string;
};

type Sale = {
  _id: string;
  customerId: string;
  customerName: string;
  date: string;
  items: Array<{
    inventoryItemId: string;
    name: string;
    quantity: number;
    price: number;
    unit: "kg" | "litre" | "nos";
  }>;
  total: number;
  ledgerNotes: string;
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

export const createInventoryItem = async (item: Omit<InventoryItem, "_id">) => {
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
  updatedItem: Omit<InventoryItem, "_id">;
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

export const deleteInventoryItem = async (id: string) => {
  try {
    const response = await Api.patch(userRoutes.deleteInventory, { id });
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

export const createCustomer = async (customer: Omit<Customer, "_id">) => {
  try {
    const response = await Api.post(userRoutes.createCustomer, customer);
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
    const response = await Api.put(userRoutes.updateCustomer, data);
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
    console.log(data);

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

export const getSales = async (page: number, search: string) => {
  try {
    let url = `${userRoutes.getSales}/${page}`;
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

export const createSale = async (sale: Omit<Sale, "_id">) => {
  try {
    console.log(sale);

    const response = await Api.post(userRoutes.createSale, sale);
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

export const updateSale = async (data: {
  _id: string;
  updatedSale: Omit<Sale, "_id">;
}) => {
  try {
    const response = await Api.put(userRoutes.updateSale, data);
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

export const deleteSale = async (data: { id: string }) => {
  try {
    const response = await Api.patch(userRoutes.deleteSale, data);
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
