import React, { useState, useEffect } from "react";
import {
  Printer,
  FileSpreadsheet,
  FileText,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getSales, getInventoryItems } from "../api/user";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

type SalesReportItem = {
  _id: string;
  date: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
};

type ItemReportItem = {
  _id: string;
  name: string;
  quantity: number;
  price: number;
};

const ExportButtons: React.FC<{
  onExportExcel: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
}> = ({ onExportExcel, onExportPDF, onPrint }) => (
  <div className="flex space-x-2 mb-4">
    <button
      onClick={onPrint}
      className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      <Printer className="h-4 w-4 mr-2" />
      Print
    </button>
    <button
      onClick={onExportExcel}
      className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      <FileSpreadsheet className="h-4 w-4 mr-2" />
      Excel
    </button>
    <button
      onClick={onExportPDF}
      className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
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
  const [salesReport, setSalesReport] = useState<SalesReportItem[]>([]);
  const [itemsReport, setItemsReport] = useState<ItemReportItem[]>([]);
  const [salesCurrentPage, setSalesCurrentPage] = useState(1);
  const [itemsCurrentPage, setItemsCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesResponse, inventoryResponse] = await Promise.all([
          getSales(1, ""),
          getInventoryItems(1, ""),
        ]);

        setSalesReport(salesResponse.data.sales);
        setItemsReport(inventoryResponse.data.items);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const salesTotalPages = Math.ceil(salesReport.length / itemsPerPage);
  const itemsTotalPages = Math.ceil(itemsReport.length / itemsPerPage);

  const paginatedSalesReport = salesReport.slice(
    (salesCurrentPage - 1) * itemsPerPage,
    salesCurrentPage * itemsPerPage
  );

  const paginatedItemsReport = itemsReport.slice(
    (itemsCurrentPage - 1) * itemsPerPage,
    itemsCurrentPage * itemsPerPage
  );

  const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const exportToPDF = (data: any[], fileName: string, columns: string[]) => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [columns],
      body: data.map((item) => columns.map((col) => item[col])),
    });
    doc.save(`${fileName}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (activeTab === "sales") {
      exportToExcel(salesReport, "sales_report");
    } else {
      exportToExcel(itemsReport, "items_report");
    }
  };

  const handleExportPDF = () => {
    if (activeTab === "sales") {
      const columns = ["date", "customerName", "total"];
      exportToPDF(salesReport, "sales_report", columns);
    } else {
      const columns = ["name", "quantity", "price"];
      exportToPDF(itemsReport, "items_report", columns);
    }
  };

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
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedSalesReport.map((item) => (
            <tr key={item._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(item.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.customerName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}
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
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedItemsReport.map((item) => (
            <tr key={item._id}>
              <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${item.price.toFixed(2)}
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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

      <ExportButtons
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {activeTab === "sales" && renderSalesReport()}
        {activeTab === "items" && renderItemsReport()}
      </div>
    </div>
  );
};

export default Reports;
