import { Link, useLocation } from "react-router-dom";
import { UserRole } from "~/store/AuthContext";
import { USER_PATH } from "~/utils/constants";
import { useAuth } from "~/utils/helpers";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userGlobal } = useAuth();
  return (
    // sidebar with 4 options: Students, Lessons, Chat, Profile
    // show Students if user is instructor
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <nav className="flex flex-col space-y-4">
        <p className="text-xl font-semibold mb-12">Dashboard</p>
        {userGlobal?.role === UserRole.INSTRUCTOR && (
          <Link
            to={USER_PATH.STUDENTS}
            className={`px-4 py-2 rounded-md text-gray-700 hover:text-blue-500 ${
              currentPath.includes(USER_PATH.STUDENTS) &&
              "font-bold bg-blue-500 text-white hover:bg-blue-200"
            }`}
          >
            Students
          </Link>
        )}
        <Link
          to={USER_PATH.LESSONS}
          className={`px-4 py-2 rounded-md text-gray-700 hover:text-blue-500 ${
            currentPath.includes(USER_PATH.LESSONS) &&
            "font-bold bg-blue-500 text-white hover:bg-blue-200 "
          }`}
        >
          Lessons
        </Link>
        <Link
          to={USER_PATH.CHAT}
          className={`px-4 py-2 rounded-md text-gray-700 hover:text-blue-500 ${
            currentPath.includes(USER_PATH.CHAT) &&
            "font-bold bg-blue-500 text-white hover:bg-blue-200"
          }`}
        >
          Chat
        </Link>
        <Link
          to={USER_PATH.PROFILE}
          className={`px-4 py-2 rounded-md text-gray-700 hover:text-blue-500 ${
            currentPath.includes(USER_PATH.PROFILE) &&
            "font-bold bg-blue-500 text-white hover:bg-blue-200"
          }`}
        >
          Profile
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
