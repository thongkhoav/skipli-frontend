import { Outlet } from "react-router-dom";
import Header from "~/components/Header/Header";
import Sidebar from "~/components/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <main className="min-h-screen">
      <div className="flex flex-row">
        <Sidebar />
        <div>
          <Header />
          <Outlet />
        </div>
      </div>
    </main>
  );
}
