import { Link, useLocation } from "react-router-dom";
import { USER_PATH } from "~/utils/constants";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  console.log("Current Path:", currentPath);
  return (
    // sidebar with 3 options: Students, Lessons and Chat
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <nav className="flex flex-col space-y-4">
        <p className="text-xl font-semibold mb-12">Dashboard</p>
        <Link
          to={USER_PATH.STUDENTS}
          className={`px-4 py-2 rounded-md text-gray-700 hover:text-blue-500 ${
            currentPath.includes(USER_PATH.STUDENTS)
              ? "font-bold bg-blue-500 text-white"
              : ""
          }`}
        >
          Students
        </Link>
        <Link
          to={USER_PATH.LESSONS}
          className={`px-4 py-2 rounded-md text-gray-700 hover:text-blue-500 ${
            currentPath.includes(USER_PATH.LESSONS)
              ? "font-bold bg-blue-500 text-white"
              : ""
          }`}
        >
          Lessons
        </Link>
        <Link
          to={USER_PATH.CHAT}
          className={`px-4 py-2 rounded-md text-gray-700 hover:text-blue-500 ${
            currentPath.includes(USER_PATH.CHAT)
              ? "font-bold bg-blue-500 text-white"
              : ""
          }`}
        >
          Chat
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
