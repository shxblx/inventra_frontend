import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

interface PublicRouteProps {
  element: React.ReactElement;
  redirectTo: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element, redirectTo }) => {
  const userInfo = useSelector((state: RootState) => state.userInfo.userInfo);

  return userInfo ? <Navigate to={redirectTo} replace /> : element;
};

export default PublicRoute;
