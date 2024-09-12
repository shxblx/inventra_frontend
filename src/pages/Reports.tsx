import React, { useState } from "react";
import {
  Printer,
  FileSpreadsheet,
  FileText,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Define types
type SalesReportItem = {
  date: string;
  customerName: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
};

type ItemReportItem = {
  itemName: string;
  stockQuantity: number;
  soldQuantity: number;
  revenue: number;
};

// Mock data
const mockSalesReport: SalesReportItem[] = Array.from(
  { length: 100 },
  (_, i) => ({
    date: new Date(2023, 0, i + 1).toISOString().split("T")[0],
    customerName: `Customer ${i + 1}`,
    itemName: `Item ${i + 1}`,
    quantity: Math.floor(Math.random() * 10) + 1,
    price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
    total: 0, // Will be calculated
  })
).map((item) => ({ ...item, total: item.quantity * item.price }));

const mockItemsReport: ItemReportItem[] = Array.from(
  { length: 100 },
  (_, i) => ({
    itemName: `Item ${i + 1}`,
    stockQuantity: Math.floor(Math.random() * 100) + 1,
    soldQuantity: Math.floor(Math.random() * 50) + 1,
    revenue: 0, // Will be calculated
  })
).map((item) => ({
  ...item,
  revenue: item.soldQuantity * (Math.random() * 100 + 10),
}));

const ExportButtons: React.FC = () => (
  <div className="flex space-x-2 mb-4">
    <button className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      <Printer className="h-4 w-4 mr-2" />
      Print
    </button>
    <button className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">
      <FileSpreadsheet className="h-4 w-4 mr-2" />
      Excel
    </button>
    <button className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
      <FileText className="h-4 w-4 mr-2" />
      PDF
    </button>
    <button className="flex items-center px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
      <Mail className="h-4 w-4 mr-2" />
      Email
    </button>
  </div>
);

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between mt-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="flex items-center px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
    >
      <ChevronLeft className="h-4 w-4 mr-2" />
      Previous
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="flex items-center px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
    >
      Next
      <ChevronRight className="h-4 w-4 ml-2" />
    </button>
  </div>
);

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"sales" | "items">("sales");
  const [salesCurrentPage, setSalesCurrentPage] = useState(1);
  const [itemsCurrentPage, setItemsCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const salesTotalPages = Math.ceil(mockSalesReport.length / itemsPerPage);
  const itemsTotalPages = Math.ceil(mockItemsReport.length / itemsPerPage);

  const paginatedSalesReport = mockSalesReport.slice(
    (salesCurrentPage - 1) * itemsPerPage,
    salesCurrentPage * itemsPerPage
  );

  const paginatedItemsReport = mockItemsReport.slice(
    (itemsCurrentPage - 1) * itemsPerPage,
    itemsCurrentPage * itemsPerPage
  );

  const renderSalesReport = () => (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedSalesReport.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.customerName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${item.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${item.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={salesCurrentPage}
        totalPages={salesTotalPages}
        onPageChange={setSalesCurrentPage}
      />
    </>
  );

  const renderItemsReport = () => (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sold Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Revenue
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedItemsReport.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.stockQuantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{item.soldQuantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${item.revenue.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={itemsCurrentPage}
        totalPages={itemsTotalPages}
        onPageChange={setItemsCurrentPage}
      />
    </>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#735DA5]">Reports</h1>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "sales" ? "bg-[#735DA5] text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("sales")}
        >
          Sales Report
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "items" ? "bg-[#735DA5] text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("items")}
        >
          Items Report
        </button>
      </div>

      <ExportButtons />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {activeTab === "sales" && renderSalesReport()}
        {activeTab === "items" && renderItemsReport()}
      </div>
    </div>
  );
};

export default Reports;