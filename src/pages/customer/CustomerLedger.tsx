import React, { useState, useEffect } from "react";
import { Customer } from "./CustomerList";

type LedgerEntry = {
  _id: string;
  date: string;
  description: string;
  items: string; // Added items field
  quantity: number; // Added quantity field
  amount: number;
};

type CustomerLedgerProps = {
  customer: Customer;
};

const CustomerLedger: React.FC<CustomerLedgerProps> = ({ customer }) => {
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, _setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLedgerEntries = () => {
      setIsLoading(true);
      setTimeout(() => {
        const dummyLedger: LedgerEntry[] = [
          {
            _id: "1",
            date: "2023-09-01",
            description: "Initial deposit",
            items: "N/A", // No items for initial deposit
            quantity: 0, // No quantity for deposit
            amount: 1000,
          },
          {
            _id: "2",
            date: "2023-09-05",
            description: "Purchase of goods",
            items: "Tomatoes, Potatoes",
            quantity: 10,
            amount: 250,
          },
          {
            _id: "3",
            date: "2023-09-10",
            description: "Payment received",
            items: "N/A", // No items for payment received
            quantity: 0, // No quantity for payment received
            amount: 500,
          },
          {
            _id: "4",
            date: "2023-09-15",
            description: "Service fee",
            items: "N/A", // No items for service fee
            quantity: 0,
            amount: 50,
          },
          {
            _id: "5",
            date: "2023-09-20",
            description: "Refund issued",
            items: "N/A", // No items for refund issued
            quantity: 0,
            amount: 75,
          },
        ];

        setLedgerEntries(dummyLedger);
        setIsLoading(false);
      }, 1000); // Simulate 1 second loading time
    };

    fetchLedgerEntries();
  }, [customer._id]);

  if (isLoading) {
    return <div>Loading ledger...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const calculateBalance = () => {
    return ledgerEntries.reduce((balance, entry) => {
      return balance + entry.amount;
    }, 0);
  };

  const calculateTotalQuantity = () => {
    return ledgerEntries.reduce((total, entry) => total + entry.quantity, 0);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Customer Ledger: {customer.name}
      </h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ledgerEntries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No ledger entries found
                </td>
              </tr>
            ) : (
              ledgerEntries.map((entry) => (
                <tr key={entry._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${entry.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <p className="text-lg font-semibold">
          Total Quantity: {calculateTotalQuantity()}
        </p>
        <p className="text-lg font-semibold">
          Current Balance: ${calculateBalance().toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CustomerLedger;
