import React, { useState, useEffect, useCallback } from "react";
import { Search, Edit, Trash, Plus } from "lucide-react";
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
} from "../api/user";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

type Customer = {
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

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Omit<Customer, "_id">) => void;
  editCustomer?: Customer;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editCustomer,
}) => {
  const [customer, setCustomer] = useState<Omit<Customer, "_id">>({
    name: "",
    address: "",
    mobileNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editCustomer) {
      setCustomer({
        name: editCustomer.name,
        address: editCustomer.address,
        mobileNumber: editCustomer.mobileNumber,
      });
    } else {
      setCustomer({ name: "", address: "", mobileNumber: "" });
    }
    setErrors({});
  }, [editCustomer, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!customer.name.trim()) newErrors.name = "Name is required";
    if (!customer.address.trim()) newErrors.address = "Address is required";
    if (!customer.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(customer);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {editCustomer ? "Edit Customer" : "Add New Customer"}
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
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              className={`w-full p-2 border rounded ${
                errors.address ? "border-red-500" : ""
              }`}
              value={customer.address}
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              type="tel"
              className={`w-full p-2 border rounded ${
                errors.mobileNumber ? "border-red-500" : ""
              }`}
              value={customer.mobileNumber}
              onChange={(e) =>
                setCustomer({ ...customer, mobileNumber: e.target.value })
              }
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
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
              {editCustomer ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(
    undefined
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

  const handleCreateCustomer = async (newCustomer: Omit<Customer, "_id">) => {
    try {
      const response = await createCustomer(newCustomer);
      if (response.status === 200) {
        fetchCustomers(currentPage, searchTerm);
        toast.success(response.data);
      } else {
        toast.error(response.data);
      }
    } catch (err) {
      setError("An error occurred while creating the customer");
    }
  };

  const handleEditCustomer = async (updatedCustomer: Omit<Customer, "_id">) => {
    if (!editingCustomer) return;
    try {
      const response = await updateCustomer({
        _id: editingCustomer._id,
        updatedCustomer,
      });
      if (response.status === 200) {
        fetchCustomers(currentPage, searchTerm);
        toast.success("Customer updated successfully");
      } else {
        toast.error("Failed to update customer");
      }
    } catch (err) {
      setError("An error occurred while updating the customer");
    }
    setEditingCustomer(undefined);
  };

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

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#735DA5]">Customers</h1>

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
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
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
          setEditingCustomer(undefined);
        }}
        onSubmit={editingCustomer ? handleEditCustomer : handleCreateCustomer}
        editCustomer={editingCustomer}
      />
    </div>
  );
};

export default Customers;
