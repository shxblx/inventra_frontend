import React, { useState } from "react";
import { Search, Edit, Trash, Plus, Eye } from "lucide-react";

// Define types
type Customer = {
  id: number;
  name: string;
  address: string;
  mobileNumber: string;
};

type LedgerItem = {
  id: number;
  itemName: string;
  quantity: number;
  date: string;
  price: number;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Omit<Customer, "id">) => void;
  editCustomer?: Customer;
};

type LedgerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  ledger: LedgerItem[];
};

// Mock data
const mockCustomers: Customer[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Customer ${i + 1}`,
  address: `${i + 1} Main St, City ${i + 1}, Country`,
  mobileNumber: `+1 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
}));

const generateMockLedger = (customerId: number): LedgerItem[] => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    itemName: `Item ${i + 1}`,
    quantity: Math.floor(Math.random() * 10) + 1,
    date: new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
      .toISOString()
      .split("T")[0],
    price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
  }));
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editCustomer,
}) => {
  const [customer, setCustomer] = useState<Omit<Customer, "id">>(
    editCustomer || { name: "", address: "", mobileNumber: "" }
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(customer);
    onClose();
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
              className="w-full p-2 border rounded"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              required
            />
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
              className="w-full p-2 border rounded"
              value={customer.address}
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
              required
            />
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
              className="w-full p-2 border rounded"
              value={customer.mobileNumber}
              onChange={(e) =>
                setCustomer({ ...customer, mobileNumber: e.target.value })
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
              {editCustomer ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LedgerModal: React.FC<LedgerModalProps> = ({
  isOpen,
  onClose,
  customer,
  ledger,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!isOpen) return null;

  const totalPages = Math.ceil(ledger.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLedgerItems = ledger.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-3/4 max-h-3/4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">{customer.name}'s Ledger</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentLedgerItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${item.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, ledger.length)} of{" "}
              {ledger.length} entries
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
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#735DA5] text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(
    undefined
  );
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerLedger, setCustomerLedger] = useState<LedgerItem[]>([]);

  const itemsPerPage = 10;

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobileNumber.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handleAddCustomer = (newCustomer: Omit<Customer, "id">) => {
    const id =
      customers.length > 0
        ? Math.max(...customers.map((customer) => customer.id)) + 1
        : 1;
    setCustomers([...customers, { ...newCustomer, id }]);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleUpdateCustomer = (updatedCustomer: Omit<Customer, "id">) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === editingCustomer?.id
          ? { ...customer, ...updatedCustomer }
          : customer
      )
    );
    setEditingCustomer(undefined);
  };

  const handleDeleteCustomer = (id: number) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const handleViewLedger = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerLedger(generateMockLedger(customer.id));
    setIsLedgerModalOpen(true);
  };

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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
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
            {currentCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.mobileNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewLedger(customer)}
                    className="text-green-600 hover:text-green-800 mr-2"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
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
            {Math.min(endIndex, filteredCustomers.length)} of{" "}
            {filteredCustomers.length} results
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
          setEditingCustomer(undefined);
        }}
        onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
        editCustomer={editingCustomer}
      />

      {selectedCustomer && (
        <LedgerModal
          isOpen={isLedgerModalOpen}
          onClose={() => setIsLedgerModalOpen(false)}
          customer={selectedCustomer}
          ledger={customerLedger}
        />
      )}
    </div>
  );
};

export default Customers;
