import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { USER_PATH } from "../utils/constants";
import Loading from "../components/Loading/Loading";
import MainLayout from "~/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import { UserRole } from "~/store/AuthContext";
const Students = lazy(() => import("~/pages/user/students/Students"));
const Lessons = lazy(() => import("~/pages/user/lessons/Lessons"));
const Chat = lazy(() => import("~/pages/user/chat/Chat"));
export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          path={USER_PATH.STUDENTS}
          Component={() => (
            <ProtectedRoute allowedRoles={[UserRole.INSTRUCTOR]}>
              <Suspense fallback={<Loading />}>
                <Students />
              </Suspense>
            </ProtectedRoute>
          )}
        />
        <Route
          path={USER_PATH.LESSONS}
          Component={() => (
            <ProtectedRoute
              allowedRoles={[UserRole.INSTRUCTOR, UserRole.STUDENT]}
            >
              <Suspense fallback={<Loading />}>
                <Lessons />
              </Suspense>
            </ProtectedRoute>
          )}
        />
        <Route
          path={USER_PATH.CHAT}
          Component={() => (
            <ProtectedRoute
              allowedRoles={[UserRole.INSTRUCTOR, UserRole.STUDENT]}
            >
              <Suspense fallback={<Loading />}>
                <Chat />
              </Suspense>
            </ProtectedRoute>
          )}
        />
      </Route>
    </Routes>
  );
}
