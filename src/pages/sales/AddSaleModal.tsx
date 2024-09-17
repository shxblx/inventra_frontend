import React, { useState, useEffect, useRef } from "react";
import {
  getCustomers,
  getInventoryItems,
  createSale,
  updateSale,
} from "../../api/user";
import { Plus, X } from "lucide-react";

interface Customer {
  _id: string;
  name: string;
}

interface InventoryItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  unit: "kg" | "litre" | "nos";
}

export interface SelectedItem {
  inventoryItemId: string;
  name: string;
  quantity: number;
  price: number;
  unit: "kg" | "litre" | "nos";
}

export interface Sale {
  _id?: string;
  customerId: string;
  customerName: string;
  date: string;
  items: SelectedItem[];
  total: number;
  ledgerNotes: string;
}

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sale: Omit<Sale, "_id">) => void;
  editSale?: Sale;
}

const AddSaleModal: React.FC<AddSaleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editSale,
}) => {
  const [sale, setSale] = useState<Omit<Sale, "_id">>({
    customerId: "",
    customerName: "",
    date: "",
    items: [],
    total: 0,
    ledgerNotes: "",
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const customerInputRef = useRef<HTMLInputElement>(null);
  const itemInputRef = useRef<HTMLInputElement>(null);
  const customerDropdownRef = useRef<HTMLDivElement>(null);
  const itemDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editSale) {
        const { _id, ...rest } = editSale;
        setSale(rest);
      } else {
        setSale({
          customerId: "",
          customerName: "",
          date: "",
          items: [],
          total: 0,
          ledgerNotes: "",
        });
      }
    }
  }, [isOpen, editSale]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(customerSearch);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [customerSearch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInventoryItems(itemSearch);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [itemSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target as Node) &&
        customerInputRef.current !== event.target
      ) {
        setIsCustomerDropdownOpen(false);
      }
      if (
        itemDropdownRef.current &&
        !itemDropdownRef.current.contains(event.target as Node) &&
        itemInputRef.current !== event.target
      ) {
        setIsItemDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCustomers = async (search: string) => {
    try {
      const response = await getCustomers(1, search);
      setCustomers(response.data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchInventoryItems = async (search: string) => {
    try {
      const response = await getInventoryItems(1, search);
      setInventoryItems(response.data.items);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSale({ ...sale, [name]: value });
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSale({ ...sale, customerId: customer._id, customerName: customer.name });
    setCustomerSearch("");
    setIsCustomerDropdownOpen(false);
  };

  const handleCustomerRemove = () => {
    setSale({ ...sale, customerId: "", customerName: "" });
  };

  const handleItemSelect = (item: InventoryItem) => {
    const existingItem = sale.items.find((i) => i.inventoryItemId === item._id);
    if (existingItem) {
      const updatedItems = sale.items.map((i) =>
        i.inventoryItemId === item._id
          ? { ...i, quantity: Math.min(i.quantity + 1, item.quantity) }
          : i
      );
      setSale({ ...sale, items: updatedItems });
    } else {
      setSale({
        ...sale,
        items: [
          ...sale.items,
          {
            inventoryItemId: item._id,
            name: item.name,
            quantity: 1,
            price: item.price,
            unit: item.unit,
          },
        ],
      });
    }
    setItemSearch("");
    setIsItemDropdownOpen(false);
  };

  const handleItemRemove = (index: number) => {
    setSale({
      ...sale,
      items: sale.items.filter((_, i) => i !== index),
    });
  };

  const handleItemQuantityChange = (index: number, quantity: number) => {
    const item = inventoryItems.find(
      (i) => i._id === sale.items[index].inventoryItemId
    );
    if (item) {
      const updatedQuantity = Math.min(quantity, item.quantity);
      const updatedItems = [...sale.items];
      updatedItems[index].quantity = updatedQuantity;
      setSale({ ...sale, items: updatedItems });
    }
  };

  const calculateTotal = () => {
    const total = sale.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSale({ ...sale, total });
  };

  useEffect(() => {
    calculateTotal();
  }, [sale.items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const saleData: Omit<Sale, "_id"> = {
      customerId: sale.customerId,
      customerName: sale.customerName,
      date: sale.date,
      items: sale.items.map(
        ({ inventoryItemId, name, quantity, price, unit }) => ({
          inventoryItemId,
          name,
          quantity,
          price,
          unit,
        })
      ),
      total: sale.total,
      ledgerNotes: sale.ledgerNotes,
    };

    try {
      if (editSale && editSale._id) {
        await updateSale({ _id: editSale._id, updatedSale: saleData });
      } else {
        await createSale(saleData);
      }
      onSubmit(saleData);
      onClose();
    } catch (error) {
      console.error("Error submitting sale:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {editSale ? "Edit Sale" : "Add New Sale"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label
              htmlFor="customerSearch"
              className="block text-sm font-medium text-gray-700"
            >
              Search Customer
            </label>
            <input
              type="text"
              id="customerSearch"
              ref={customerInputRef}
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                setIsCustomerDropdownOpen(true);
              }}
              onFocus={() => setIsCustomerDropdownOpen(true)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Search customers..."
            />
            {isCustomerDropdownOpen && (
              <div
                ref={customerDropdownRef}
                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {customers.slice(0, 5).map((customer) => (
                  <div
                    key={customer._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <span>{customer.name}</span>
                    <button
                      type="button"
                      className="px-2 py-1 bg-[#735DA5] text-white rounded-md"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {sale.customerName && (
            <div className="mt-2 p-2 bg-gray-100 rounded-md flex items-center justify-between">
              <span>
                <span className="font-medium">Selected Customer:</span>{" "}
                {sale.customerName}
              </span>
              <button
                type="button"
                onClick={handleCustomerRemove}
                className="text-red-500"
              >
                <X size={20} />
              </button>
            </div>
          )}
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
          <div className="relative">
            <label
              htmlFor="itemSearch"
              className="block text-sm font-medium text-gray-700"
            >
              Search Inventory Items
            </label>
            <input
              type="text"
              id="itemSearch"
              ref={itemInputRef}
              value={itemSearch}
              onChange={(e) => {
                setItemSearch(e.target.value);
                setIsItemDropdownOpen(true);
              }}
              onFocus={() => setIsItemDropdownOpen(true)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Search inventory items..."
            />
            {isItemDropdownOpen && (
              <div
                ref={itemDropdownRef}
                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {inventoryItems.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleItemSelect(item)}
                  >
                    <span>
                      {item.name} - ${item.price.toFixed(2)} per {item.unit}{" "}
                      (Available: {item.quantity})
                    </span>
                    <button
                      type="button"
                      className="px-2 py-1 bg-[#735DA5] text-white rounded-md"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Items</h3>
            {sale.items.length === 0 ? (
              <p>No items added yet.</p>
            ) : (
              sale.items.map((item, index) => {
                const inventoryItem = inventoryItems.find(
                  (i) => i._id === item.inventoryItemId
                );
                const totalPrice = item.price * item.quantity;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between mb-2 p-2 border border-gray-300 rounded-md"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span> - $
                      {item.price.toFixed(2)} per {item.unit} x{" "}
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        max={inventoryItem ? inventoryItem.quantity : 1}
                        onChange={(e) =>
                          handleItemQuantityChange(
                            index,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-16 text-center border border-gray-300 rounded-md"
                      />{" "}
                      = ${totalPrice.toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleItemRemove(index)}
                      className="text-red-500"
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <div>
            <label
              htmlFor="total"
              className="block text-sm font-medium text-gray-700"
            >
              Total Amount
            </label>
            <input
              type="number"
              id="total"
              name="total"
              value={sale.total}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#735DA5] text-white rounded-md"
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
