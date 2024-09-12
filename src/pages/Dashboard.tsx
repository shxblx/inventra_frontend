import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Package, DollarSign, Users, TrendingUp } from "lucide-react";

// Mock data for the chart
const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
];

const Dashboard = () => {
  const totalInventory = 1500;
  const totalSales = 25000;
  const totalCustomers = 500;
  const totalProfit = 8000;

  interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => (
    <div className="p-6 rounded-lg shadow-md bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className="h-4 w-4 text-[#735DA5]" />
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );

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
          value={`$${totalSales.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard title="Total Customers" value={totalCustomers} icon={Users} />
        <StatCard
          title="Total Profit"
          value={`$${totalProfit.toLocaleString()}`}
          icon={TrendingUp}
        />
      </div>

      <div className="p-6 rounded-lg shadow-md mt-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
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
    </div>
  );
};

export default Dashboard;
