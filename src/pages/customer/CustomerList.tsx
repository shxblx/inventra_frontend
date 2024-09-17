import React, { useState, useEffect, useCallback } from "react";
import { Search, Edit, Trash, Plus, FileText } from "lucide-react";
import { getCustomers, deleteCustomer } from "../../api/user";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import CustomerModal from "./CustomerModal";
import CustomerLedger from "./CustomerLedger";

export type Customer = {
  _id: string;
  name: string;
  address: string;
  mobileNumber: string;
};

type PaginationData = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(
    undefined
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchCustomers = useCallback(async (page: number, search: string) => {
    try {
      setIsLoading(true);
      const response = await getCustomers(page, search);
      console.log(response);

      if (response.status === 200) {
        setCustomers(response.data.customers);
        setPaginationData({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems,
        });
      } else {
        setError("Failed to fetch customers");
      }
    } catch (err) {
      setError("An error occurred while fetching customers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(currentPage, searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm, fetchCustomers]);

  const handleDeleteCustomer = async (id: string) => {
    try {
      const response = await deleteCustomer({ id });
      if (response.status === 200) {
        toast.success("Customer deleted successfully");
        fetchCustomers(currentPage, searchTerm);
      } else {
        toast.error("Failed to delete customer");
      }
    } catch (err) {
      setError("An error occurred while deleting the customer");
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(undefined);
    setIsModalOpen(true);
  };

  const handleEditCustomerClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCustomer(undefined);
    fetchCustomers(currentPage, searchTerm);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#735DA5]">Customers</h1>

      {selectedCustomer ? (
        <>
          <CustomerLedger customer={selectedCustomer} />
          <button
            onClick={() => setSelectedCustomer(null)}
            className="mt-4 px-4 py-2 bg-gray-200 rounded"
          >
            Back to Customer List
          </button>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleAddCustomer}
              className="flex items-center px-4 py-2 bg-[#735DA5] text-white rounded-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Customer
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
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.mobileNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEditCustomerClick(customer)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer._id)}
                          className="text-red-600 hover:text-red-800 mr-2"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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

          <CustomerModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            editCustomer={editingCustomer}
          />
        </>
      )}
    </div>
  );
};

export default CustomerList;
