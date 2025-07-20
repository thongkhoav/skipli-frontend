import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { GUEST_PATH, USER_PATH } from "../utils/constants";
import Loading from "../components/Loading/Loading";
import { useAuth } from "~/utils/helpers";
import { UserRole } from "~/store/AuthContext";
const LoginPhone = lazy(() => import("~/pages/guest/login-phone/LoginPhone"));
const LoginEmail = lazy(() => import("~/pages/guest/login-email/LoginEmail"));
const LoginAccount = lazy(
  () => import("~/pages/guest/login-account/LoginAccount")
);
const StudentSetup = lazy(
  () => import("~/pages/guest/student-setup/StudentSetup")
);

export default function GuestRoutes() {
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
        path={GUEST_PATH.LOGIN_ACCOUNT}
        Component={() => (
          <Suspense fallback={<Loading />}>
            <LoginAccount />
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
    </Routes>
  );
}
