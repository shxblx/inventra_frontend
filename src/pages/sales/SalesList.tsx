import React, { useState, useEffect } from "react";
import { Search, Trash, Plus } from "lucide-react";
import AddSaleModal, { Sale } from "./AddSaleModal";
import { getSales, deleteSale } from "../../api/user";
import Loader from "../../components/Loader";

const SalesList: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getSales(currentPage, searchTerm);
        console.log("API Response:", response);

        const { sales, totalPages } = response.data;
        if (Array.isArray(sales)) {
          setSales(sales);
          setTotalPages(totalPages);
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

    fetchSales();
  }, [currentPage, searchTerm]);

  const handleDeleteSale = async (id: string | undefined) => {
    if (!id) {
      console.error("Attempted to delete a sale without an ID");
      setError("Cannot delete sale: Invalid ID");
      return;
    }

    try {
      await deleteSale({ id });
      const response = await getSales(currentPage, searchTerm);
      const { sales, totalPages } = response.data;
      if (Array.isArray(sales)) {
        setSales(sales);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      setError("Failed to delete sale. Please try again.");
    }
  };

  if (isLoading) {
    return <Loader />;
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

      {sales.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No sales found. Add a new sale to get started!
        </div>
      ) : (
        <>
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
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.items.map((item) => (
                        <div key={item.inventoryItemId}>
                          {item.name} ({item.quantity} {item.unit})
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{sale.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteSale(sale._id)}
                        className="ml-3 text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end items-center mt-4">
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
        </>
      )}

      <AddSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {
          setIsModalOpen(false);
          getSales(currentPage, searchTerm).then((response) => {
            const { sales, totalPages } = response.data;
            if (Array.isArray(sales)) {
              setSales(sales);
              setTotalPages(totalPages);
            }
          });
        }}
      />
    </div>
  );
};

export default SalesList;
