import React, { useState } from "react";
import { Search, Edit, Trash, Plus } from "lucide-react";

// Define types
type Sale = {
  id: number;
  inventoryItem: string;
  customerName: string;
  date: string;
  quantity: number;
  price: number;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sale: Omit<Sale, "id">) => void;
  editSale?: Sale;
};

// Mock data
const mockSales: Sale[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  inventoryItem: `Item ${i + 1}`,
  customerName: `Customer ${i + 1}`,
  date: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split("T")[0],
  quantity: Math.floor(Math.random() * 10) + 1,
  price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
}));

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editSale,
}) => {
  const [sale, setSale] = useState<Omit<Sale, "id">>(
    editSale || {
      inventoryItem: "",
      customerName: "",
      date: "",
      quantity: 0,
      price: 0,
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(sale);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {editSale ? "Edit Sale" : "Add New Sale"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="inventoryItem"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Inventory Item
            </label>
            <input
              id="inventoryItem"
              type="text"
              className="w-full p-2 border rounded"
              value={sale.inventoryItem}
              onChange={(e) =>
                setSale({ ...sale, inventoryItem: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              className="w-full p-2 border rounded"
              value={sale.customerName}
              onChange={(e) =>
                setSale({ ...sale, customerName: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              className="w-full p-2 border rounded"
              value={sale.date}
              onChange={(e) => setSale({ ...sale, date: e.target.value })}
              required
            />
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
              className="w-full p-2 border rounded"
              value={sale.quantity}
              onChange={(e) =>
                setSale({ ...sale, quantity: parseInt(e.target.value) })
              }
              required
            />
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
              className="w-full p-2 border rounded"
              value={sale.price}
              onChange={(e) =>
                setSale({ ...sale, price: parseFloat(e.target.value) })
              }
              required
            />
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
              {editSale ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSale, setEditingSale] = useState<Sale | undefined>(undefined);

  const itemsPerPage = 10;

  const filteredSales = sales.filter(
    (sale) =>
      sale.inventoryItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.date.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = filteredSales.slice(startIndex, endIndex);

  const handleAddSale = (newSale: Omit<Sale, "id">) => {
    const id =
      sales.length > 0 ? Math.max(...sales.map((sale) => sale.id)) + 1 : 1;
    setSales([...sales, { ...newSale, id }]);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleUpdateSale = (updatedSale: Omit<Sale, "id">) => {
    setSales(
      sales.map((sale) =>
        sale.id === editingSale?.id ? { ...sale, ...updatedSale } : sale
      )
    );
    setEditingSale(undefined);
  };

  const handleDeleteSale = (id: number) => {
    setSales(sales.filter((sale) => sale.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#735DA5]">Sales</h1>

      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search sales..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-[#735DA5] text-white rounded-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Sale
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inventory Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
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
            {currentSales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sale.inventoryItem}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sale.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${sale.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditSale(sale)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSale(sale.id)}
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
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredSales.length)} of {filteredSales.length}{" "}
            results
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
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
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
          setEditingSale(undefined);
        }}
        onSubmit={editingSale ? handleUpdateSale : handleAddSale}
        editSale={editingSale}
      />
    </div>
  );
};

export default Sales;
