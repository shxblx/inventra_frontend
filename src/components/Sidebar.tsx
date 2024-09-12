import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart2, Package, Users, DollarSign } from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#735DA5] text-white h-full">
      <div className="p-4">
        <h1 className="text-2xl font-bold">INVENTRA</h1>
      </div>
      <nav className="mt-6">
        <Link
          to="/dashboard"
          className={`block py-2 px-4 hover:bg-[#8A74B9] transition-colors duration-200 ${
            location.pathname === "/dashboard" ? "bg-[#8A74B9]" : ""
          }`}
        >
          <div className="flex items-center">
            <BarChart2 className="mr-2" />
            Dashboard
          </div>
        </Link>
        <Link
          to="/inventory"
          className={`block py-2 px-4 hover:bg-[#8A74B9] transition-colors duration-200 ${
            location.pathname === "/inventory" ? "bg-[#8A74B9]" : ""
          }`}
        >
          <div className="flex items-center">
            <Package className="mr-2" />
            Inventory
          </div>
        </Link>
        <Link
          to="/customers"
          className={`block py-2 px-4 hover:bg-[#8A74B9] transition-colors duration-200 ${
            location.pathname === "/customers" ? "bg-[#8A74B9]" : ""
          }`}
        >
          <div className="flex items-center">
            <Users className="mr-2" />
            Customers
          </div>
        </Link>
        <Link
          to="/sales"
          className={`block py-2 px-4 hover:bg-[#8A74B9] transition-colors duration-200 ${
            location.pathname === "/sales" ? "bg-[#8A74B9]" : ""
          }`}
        >
          <div className="flex items-center">
            <DollarSign className="mr-2" />
            Sales
          </div>
        </Link>
        <Link
          to="/reports"
          className={`block py-2 px-4 hover:bg-[#8A74B9] transition-colors duration-200 ${
            location.pathname === "/reports" ? "bg-[#8A74B9]" : ""
          }`}
        >
          <div className="flex items-center">
            <BarChart2 className="mr-2" />
            Reports
          </div>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;