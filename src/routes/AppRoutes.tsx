import { BrowserRouter } from "react-router-dom";
import GuestRoutes from "./GuestRoutes";
import AuthProvider from "~/store/AuthProvider";
import UserRoutes from "./UserRoutes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GuestRoutes />
        <UserRoutes />
        {/* <NotFoundRoutes /> */}
      </AuthProvider>
    </BrowserRouter>
  );
}
