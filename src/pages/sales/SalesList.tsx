import React, { useState, useEffect } from "react";
import { Search, Edit, Trash, Plus } from "lucide-react";
import AddSaleModal, { Sale } from "./AddSaleModal";
import { getSales, createSale, updateSale, deleteSale } from "../../api/user";

const SalesList: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSale, setEditingSale] = useState<Sale | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchSales();
  }, [currentPage, searchTerm]);

  const fetchSales = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSales(currentPage, searchTerm);
      if (response.data && response.data.sales) {
        setSales(response.data.sales);
        setTotalPages(response.data.totalPages);
      } else {
        setSales([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      setError("Failed to fetch sales. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSale = async (newSale: Omit<Sale, "_id" | "customerName">) => {
    try {
      await createSale(newSale);
      fetchSales();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding sale:", error);
      setError("Failed to add sale. Please try again.");
    }
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleUpdateSale = async (
    updatedSale: Omit<Sale, "_id" | "customerName">
  ) => {
    try {
      if (editingSale?._id) {
        await updateSale({ _id: editingSale._id, updatedSale });
        fetchSales();
        setEditingSale(undefined);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating sale:", error);
      setError("Failed to update sale. Please try again.");
    }
  };

  const handleDeleteSale = async (id: string) => {
    try {
      await deleteSale({ id });
      fetchSales();
    } catch (error) {
      console.error("Error deleting sale:", error);
      setError("Failed to delete sale. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

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
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No sales found. Add a new sale to get started!
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sale.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sale.items
                      .map(
                        (item) => `${item.inventoryItemId} (${item.quantity})`
                      )
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${sale.items
                      .reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEditSale(sale)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSale(sale._id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sales.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, sales.length)} of{" "}
              {sales.length} results
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
      )}

      <AddSaleModal
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

export default SalesList;
