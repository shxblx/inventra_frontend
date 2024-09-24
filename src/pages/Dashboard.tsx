import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Package, DollarSign, Users } from "lucide-react";
import { getInventoryItems, getCustomers, getSales } from "../api/user"; 

type InventoryItem = {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  unit: "kg" | "litre" | "nos";
};

type Customer = {
  _id: string;
  name: string;
  address: string;
  mobileNumber: string;
};

type Sale = {
  _id: string;
  customerId: string;
  customerName: string;
  date: string;
  items: Array<{
    inventoryItemId: string;
    name: string;
    quantity: number;
    price: number;
    unit: "kg" | "litre" | "nos";
  }>;
  total: number;
  ledgerNotes: string;
};

type ChartData = {
  name: string;
  sales: number;
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}

const Dashboard: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryResponse, customersResponse, salesResponse] =
          await Promise.all([
            getInventoryItems(1, ""),
            getCustomers(1, ""),
            getSales(1, ""),
          ]);

        setInventoryItems(inventoryResponse.data.items);
        setCustomers(customersResponse.data.customers);
        setSales(salesResponse.data.sales);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalInventory = inventoryItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalCustomers = customers.length;

  const salesData: ChartData[] = sales
    .map((sale) => ({
      name: new Date(sale.date).toLocaleDateString(),
      sales: sale.total,
    }))
    .slice(-6); // Last 6 sales for the chart

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => (
    <div className="p-6 rounded-lg shadow-md bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className="h-4 w-4 text-[#735DA5]" />
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#735DA5]">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Inventory"
          value={totalInventory}
          icon={Package}
        />
        <StatCard
          title="Total Sales"
          value={`₹${totalSales.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard title="Total Customers" value={totalCustomers} icon={Users} />
      </div>

      <div className="p-6 rounded-lg shadow-md mt-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#735DA5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Recent Inventory Items</h2>
          <ul className="space-y-2">
            {inventoryItems.slice(0, 5).map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>{item.name}</span>
                <span>
                  {item.quantity} {item.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Recent Customers</h2>
          <ul className="space-y-2">
            {customers.slice(0, 5).map((customer) => (
              <li key={customer._id}>{customer.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
