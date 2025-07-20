import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { USER_PATH } from "../utils/constants";
import Loading from "../components/Loading/Loading";
import MainLayout from "~/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
const Students = lazy(() => import("~/pages/user/students/Students"));
const Lessons = lazy(() => import("~/pages/user/lessons/Lessons"));
const Chat = lazy(() => import("~/pages/user/chat/Chat"));
export default function UserRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path={USER_PATH.STUDENTS}
          Component={() => (
            <Suspense fallback={<Loading />}>
              <Students />
            </Suspense>
          )}
        />
        <Route
          path={USER_PATH.LESSONS}
          Component={() => (
            <Suspense fallback={<Loading />}>
              <Lessons />
            </Suspense>
          )}
        />
        <Route
          path={USER_PATH.CHAT}
          Component={() => (
            <Suspense fallback={<Loading />}>
              <Chat />
            </Suspense>
          )}
        />
      </Route>
    </Routes>
  );
}
