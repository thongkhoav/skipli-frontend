import { Link, Route, Routes } from "react-router-dom";
import { GUEST_PATH } from "../utils/constants";

export default function NotFoundRoutes() {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <div className="max-w-md mx-auto mt-20 text-center ">
            <p>Page Not Found</p>
            <Link
              to={GUEST_PATH.LOGIN_PHONE}
              className="text-indigo-500 hover:underline"
            >
              Go to Login
            </Link>
          </div>
        }
      />
    </Routes>
  );
}
