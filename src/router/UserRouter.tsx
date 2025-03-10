import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import UserLayout from "../components/UserLayout";
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/inventory/Inventory";
import Customers from "../pages/customer/CustomerList";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import PublicRoute from "../components/PublicRoute";
import Reports from "../pages/Reports";
import SalesList from "../pages/sales/SalesList";

export const UserRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={<PublicRoute element={<Login />} redirectTo="/dashboard" />}
      />
      <Route
        path="/"
        element={
          <AuthenticatedRoute element={<UserLayout />} redirectTo="/login" />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/sales" element={<SalesList />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default UserRouter;
