import React, { useState, useEffect } from "react";
import { Customer } from "./CustomerList";

type LedgerEntry = {
  _id: string;
  date: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
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
            amount: 1000,
            type: "credit",
          },
          {
            _id: "2",
            date: "2023-09-05",
            description: "Purchase of goods",
            amount: 250,
            type: "debit",
          },
          {
            _id: "3",
            date: "2023-09-10",
            description: "Payment received",
            amount: 500,
            type: "credit",
          },
          {
            _id: "4",
            date: "2023-09-15",
            description: "Service fee",
            amount: 50,
            type: "debit",
          },
          {
            _id: "5",
            date: "2023-09-20",
            description: "Refund issued",
            amount: 75,
            type: "debit",
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
      return entry.type === "credit"
        ? balance + entry.amount
        : balance - entry.amount;
    }, 0);
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
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ledgerEntries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.type === "credit"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {entry.type}
                    </span>
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
          Current Balance: ${calculateBalance().toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CustomerLedger;