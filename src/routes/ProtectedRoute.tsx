// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { UserRole } from "~/store/AuthContext";
import { GUEST_PATH } from "~/utils/constants";
import { getUserData, useAuth } from "~/utils/helpers";

interface Props {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles = [], children }: Props) {
  const { userGlobal } = useAuth();
  const userData = getUserData();

  if (
    !userData ||
    (userGlobal && !allowedRoles?.includes(userGlobal?.role as UserRole))
  ) {
    return <Navigate to={GUEST_PATH.LOGIN_PHONE} replace />;
  }

  return children;
}
