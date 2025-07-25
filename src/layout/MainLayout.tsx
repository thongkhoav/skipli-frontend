import { Outlet } from "react-router-dom";
import Header from "~/components/Header/Header";
import Sidebar from "~/components/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <main className="h-screen">
      <div className="flex flex-row w-screen">
        <Sidebar />
        <div className="flex flex-col h-screen w-full">
          <Header />
          <Outlet />
        </div>
      </div>
    </main>
  );
}
