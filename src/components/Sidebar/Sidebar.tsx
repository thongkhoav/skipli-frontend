import { Link } from "react-router-dom";
import { USER_PATH } from "~/utils/constants";

const Sidebar = () => {
  return (
    // sidebar with 3 options: Students, Lessons and Chat
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <nav className="flex flex-col space-y-4">
        <Link
          to={USER_PATH.STUDENTS}
          className="text-gray-700 hover:text-blue-500"
        >
          Students
        </Link>
        <Link
          to={USER_PATH.LESSONS}
          className="text-gray-700 hover:text-blue-500"
        >
          Lessons
        </Link>
        <Link to={USER_PATH.CHAT} className="text-gray-700 hover:text-blue-500">
          Chat
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
