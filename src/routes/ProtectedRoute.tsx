// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { GUEST_PATH } from "~/utils/constants";

export default function ProtectedRoute({ children }: any) {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to={GUEST_PATH.LOGIN_PHONE} replace />;
  }

  return children;
}
