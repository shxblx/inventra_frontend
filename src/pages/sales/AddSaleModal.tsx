import React, { useState, useEffect } from "react";
import { getCustomers, getInventoryItems } from "../../api/user";

interface Customer {
  id: string;
  name: string;
}

interface InventoryItem {
  _id: string;
  name: string;
  price: number;
}

export interface SelectedItem {
  inventoryItemId: string;
  quantity: number;
  price: number;
}

export interface Sale {
  _id?: string;
  customerId: string;
  customerName?: string;
  date: string;
  items: SelectedItem[];
  debit: number;
  ledgerNotes: string;
}

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sale: Omit<Sale, "_id" | "customerName">) => void;
  editSale?: Sale;
}

const AddSaleModal: React.FC<AddSaleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editSale,
}) => {
  const [sale, setSale] = useState<Omit<Sale, "_id" | "customerName">>({
    customerId: "",
    date: "",
    items: [],
    debit: 0,
    ledgerNotes: "",
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchInventoryItems();
      if (editSale) {
        const { _id, customerName, ...rest } = editSale;
        setSale(rest);
      } else {
        setSale({
          customerId: "",
          date: "",
          items: [],
          debit: 0,
          ledgerNotes: "",
        });
      }
    }
  }, [isOpen, editSale]);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers(1, "");
      setCustomers(response.data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const response = await getInventoryItems(1, "");
      setInventoryItems(response.data.items);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setSale({ ...sale, [name]: name === "debit" ? parseFloat(value) : value });
  };

  const handleItemSelect = (item: InventoryItem) => {
    setSale({
      ...sale,
      items: [
        ...sale.items,
        { inventoryItemId: item._id, quantity: 1, price: item.price },
      ],
    });
  };

  const handleItemRemove = (index: number) => {
    setSale({
      ...sale,
      items: sale.items.filter((_, i) => i !== index),
    });
  };

  const handleItemQuantityChange = (index: number, quantity: number) => {
    const updatedItems = [...sale.items];
    updatedItems[index].quantity = quantity;
    setSale({ ...sale, items: updatedItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(sale);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {editSale ? "Edit Sale" : "Add New Sale"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="customerId"
              className="block text-sm font-medium text-gray-700"
            >
              Customer
            </label>
            <select
              id="customerId"
              name="customerId"
              value={sale.customerId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={sale.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="inventoryItem"
              className="block text-sm font-medium text-gray-700"
            >
              Add Inventory Items
            </label>
            <select
              id="inventoryItem"
              onChange={(e) => handleItemSelect(JSON.parse(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select an item</option>
              {inventoryItems.map((item) => (
                <option key={item._id} value={JSON.stringify(item)}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">
              Selected Items
            </h3>
            {sale.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <span>
                  {
                    inventoryItems.find((i) => i._id === item.inventoryItemId)
                      ?.name
                  }
                </span>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemQuantityChange(index, parseInt(e.target.value))
                  }
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => handleItemRemove(index)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div>
            <label
              htmlFor="debit"
              className="block text-sm font-medium text-gray-700"
            >
              Debit
            </label>
            <input
              type="number"
              id="debit"
              name="debit"
              value={sale.debit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="ledgerNotes"
              className="block text-sm font-medium text-gray-700"
            >
              Ledger Notes
            </label>
            <textarea
              id="ledgerNotes"
              name="ledgerNotes"
              value={sale.ledgerNotes}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {editSale ? "Update Sale" : "Add Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSaleModal;
