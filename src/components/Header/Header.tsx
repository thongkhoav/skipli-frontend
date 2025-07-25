import { UserRole } from "~/store/AuthContext";
import { useAuth } from "~/utils/helpers/auth";

const Header = () => {
  const { userGlobal, onLogout } = useAuth();

  return (
    <header className="flex bg-light justify-end px-10 py-4 w-full h-fit bg-slate-200">
      <img
        className="w-10 h-10 rounded-full mr-4"
        src={
          userGlobal?.role === UserRole.INSTRUCTOR
            ? "https://static.vecteezy.com/system/resources/thumbnails/042/891/253/small_2x/professional-teacher-avatar-illustration-for-education-concept-vector.jpg"
            : "https://i.pinimg.com/564x/51/90/10/519010d9ee8167bfe445e616f260f758.jpg"
        }
      />
      <p className="flex items-center">{userGlobal?.name}</p>
      <button
        onClick={onLogout}
        className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 hover:cursor-pointer"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
