import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

interface AuthenticatedRouteProps {
  element: React.ReactElement;
  redirectTo: string;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ element, redirectTo }) => {
  const userInfo = useSelector((state: RootState) => state.userInfo.userInfo);

  return userInfo ? element : <Navigate to={redirectTo} replace />;
};

export default AuthenticatedRoute;
