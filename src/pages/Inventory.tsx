import React, { useState, useEffect, useCallback } from "react";
import { Search, Edit, Trash, Plus } from "lucide-react";
import {
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItems,
} from "../api/user";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

type InventoryItem = {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
};

type PaginationData = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<InventoryItem, "_id">) => void;
  editItem?: InventoryItem;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editItem,
}) => {
  const [item, setItem] = useState<Omit<InventoryItem, "_id">>({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editItem) {
      setItem({
        name: editItem.name,
        description: editItem.description,
        quantity: editItem.quantity,
        price: editItem.price,
      });
    } else {
      setItem({ name: "", description: "", quantity: 0, price: 0 });
    }
    setErrors({});
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!item.name.trim()) newErrors.name = "Name is required";
    if (!item.description.trim())
      newErrors.description = "Description is required";
    if (item.quantity < 0)
      newErrors.quantity = "Quantity must be a non-negative number";
    if (item.price < 0) newErrors.price = "Price must be a non-negative number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(item);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {editItem ? "Edit Item" : "Add New Item"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              className={`w-full p-2 border rounded ${
                errors.name ? "border-red-500" : ""
              }`}
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              className={`w-full p-2 border rounded ${
                errors.description ? "border-red-500" : ""
              }`}
              value={item.description}
              onChange={(e) =>
                setItem({ ...item, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              className={`w-full p-2 border rounded ${
                errors.quantity ? "border-red-500" : ""
              }`}
              value={item.quantity}
              onChange={(e) =>
                setItem({ ...item, quantity: parseInt(e.target.value) || 0 })
              }
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              className={`w-full p-2 border rounded ${
                errors.price ? "border-red-500" : ""
              }`}
              value={item.price}
              onChange={(e) =>
                setItem({ ...item, price: parseFloat(e.target.value) || 0 })
              }
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#735DA5] text-white rounded"
            >
              {editItem ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const fetchInventory = useCallback(async (page: number, search: string) => {
    try {
      setIsLoading(true);
      const response = await getInventoryItems(page, search);

      if (response.status === 200) {
        setInventory(response.data.items);
        setPaginationData({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems,
        });
      } else {
        setError("Failed to fetch inventory items");
      }
    } catch (err) {
      setError("An error occurred while fetching inventory items");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInventory(currentPage, searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm, fetchInventory]);

  const handleCreateInventory = async (newItem: Omit<InventoryItem, "_id">) => {
    try {
      const response = await createInventoryItem(newItem);
      if (response.status === 200) {
        fetchInventory(currentPage, searchTerm);
        toast.success(response.data);
      } else {
        toast.error(response.data);
      }
    } catch (err) {
      setError("An error occurred while creating the inventory item");
    }
  };

  const handleEditInventory = async (
    updatedItem: Omit<InventoryItem, "_id">
  ) => {
    if (!editingItem) return;
    try {
      const response = await updateInventoryItem({
        _id: editingItem._id,
        updatedItem,
      });
      if (response.status === 200) {
        fetchInventory(currentPage, searchTerm);
        toast.success(response.data);
      } else {
        toast.error(response.data);
      }
    } catch (err) {
      setError("An error occurred while updating the inventory item");
    }
    setEditingItem(undefined);
  };

  const handleDeleteInventory = async (id: string) => {
    try {
      const response = await deleteInventoryItem({ id });
      if (response.status === 200) {
        toast.success(response.data);
        fetchInventory(currentPage, searchTerm);
      } else {
        toast.error(response.data);
        setError("Failed to delete inventory item");
      }
    } catch (err) {
      setError("An error occurred while deleting the inventory item");
    }
  };

  const handleAddItem = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#735DA5]">Inventory</h1>

      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search inventory..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleAddItem}
          className="flex items-center px-4 py-2 bg-[#735DA5] text-white rounded-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Item
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteInventory(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-sm text-gray-700">
            Showing {(paginationData.currentPage - 1) * 10 + 1} to{" "}
            {Math.min(
              paginationData.currentPage * 10,
              paginationData.totalItems
            )}{" "}
            of {paginationData.totalItems} results
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, paginationData.totalPages)
              )
            }
            disabled={currentPage === paginationData.totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(undefined);
        }}
        onSubmit={editingItem ? handleEditInventory : handleCreateInventory}
        editItem={editingItem}
      />
    </div>
  );
};

export default Inventory;
