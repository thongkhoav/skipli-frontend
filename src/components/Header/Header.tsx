import { useAuth } from "~/utils/helpers/auth";

const Header = () => {
  const { userGlobal, onLogout } = useAuth();

  return (
    <header className="flex bg-light justify-end px-10 py-4 w-full h-fit">
      <img
        className="w-10 h-10 rounded-full mr-4"
        src="https://static.vecteezy.com/system/resources/thumbnails/042/891/253/small_2x/professional-teacher-avatar-illustration-for-education-concept-vector.jpg"
      />
      <span>{userGlobal?.fullName}</span>
    </header>
  );
};

export default Header;
