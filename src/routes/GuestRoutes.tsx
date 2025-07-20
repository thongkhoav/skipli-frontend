import React, { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { GUEST_PATH } from "../utils/constants";
import Loading from "../components/Loading/Loading";
const LoginPhone = lazy(() => import("~/pages/guest/login-phone/LoginPhone"));
const LoginEmail = lazy(() => import("~/pages/guest/login-email/LoginEmail"));
const StudentSetup = lazy(
  () => import("~/pages/guest/student-setup/StudentSetup")
);

export default function LoginRoutes() {
  return (
    <Routes>
      <Route
        path={GUEST_PATH.LOGIN_PHONE}
        Component={() => (
          <Suspense fallback={<Loading />}>
            <LoginPhone />
          </Suspense>
        )}
      />
      <Route
        path={GUEST_PATH.LOGIN_EMAIL}
        Component={() => (
          <Suspense fallback={<Loading />}>
            <LoginEmail />
          </Suspense>
        )}
      />
      <Route
        path={GUEST_PATH.STUDENT_SETUP}
        Component={() => (
          <Suspense fallback={<Loading />}>
            <StudentSetup />
          </Suspense>
        )}
      />
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
