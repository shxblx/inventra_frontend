import React, { useState, useEffect, useRef } from "react";
import { Customer } from "./CustomerList";
import { LedgerEntry, getCustomerLedger } from "../../api/user";
import {
  Loader,
  ChevronUp,
  ChevronDown,
  ChevronDown as DropdownIcon,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// Add this line to extend the jsPDF type with the autoTable method
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

type CustomerLedgerProps = {
  customer: Customer;
};

const CustomerLedger: React.FC<CustomerLedgerProps> = ({ customer }) => {
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LedgerEntry;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLedgerEntries = async () => {
      setIsLoading(true);
      try {
        const response = await getCustomerLedger(customer._id);
        if (response.status === 200) {
          setLedgerEntries(response.data);
        } else {
          setError("Failed to fetch ledger entries");
        }
      } catch (err) {
        setError("An error occurred while fetching ledger entries");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLedgerEntries();
  }, [customer._id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExportOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredEntries = ledgerEntries.filter(
    (entry) => entry.description !== "Sale Total"
  );

  const sortedEntries = React.useMemo(() => {
    let sortableEntries = [...filteredEntries];
    if (sortConfig !== null) {
      sortableEntries.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEntries;
  }, [filteredEntries, sortConfig]);

  const requestSort = (key: keyof LedgerEntry) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Customer Ledger: ${customer.name}`, 14, 15);
    doc.autoTable({
      head: [["Date", "Description", "Items", "Quantity", "Amount"]],
      body: sortedEntries.map((entry) => [
        entry.date,
        entry.description,
        entry.items,
        entry.quantity,
        `$${entry.amount.toFixed(2)}`,
      ]),
    });
    doc.save(`${customer.name}_ledger.pdf`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedEntries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    XLSX.writeFile(workbook, `${customer.name}_ledger.xlsx`);
  };

  const printLedger = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Customer Ledger: {customer.name}
        </h2>
        <div className="relative" ref={dropdownRef}>
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setIsExportOpen(!isExportOpen)}
          >
            Export <DropdownIcon className="inline-block ml-2" size={14} />
          </button>
          {isExportOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  onClick={exportToPDF}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                >
                  Export to PDF
                </button>
                <button
                  onClick={exportToExcel}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                >
                  Export to Excel
                </button>
                <button
                  onClick={printLedger}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                >
                  Print
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["date", "description", "items", "quantity", "amount"].map(
                (key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort(key as keyof LedgerEntry)}
                  >
                    <div className="flex items-center">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      {sortConfig?.key === key &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp className="ml-1" size={14} />
                        ) : (
                          <ChevronDown className="ml-1" size={14} />
                        ))}
                    </div>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEntries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No ledger entries found
                </td>
              </tr>
            ) : (
              sortedEntries.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${entry.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerLedger;
