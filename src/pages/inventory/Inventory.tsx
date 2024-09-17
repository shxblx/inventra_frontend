import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import {
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItems,
} from "../../api/user";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import EditModal from "./EditModal";
import InventoryTable from "./InventoryTable";

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

  const fetchInventory = useCallback(async (page: number, search: string) => {
    try {
      setIsLoading(true);
      const response = await getInventoryItems(page, search);
      console.log(response);

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

      <InventoryTable
        inventory={inventory}
        onEdit={handleEditItem}
        onDelete={handleDeleteInventory}
      />

      <div className="flex justify-between items-center mt-4">
        <div>
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

      <EditModal
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
