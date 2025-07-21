import { UserRole } from "~/store/AuthContext";
import { useAuth } from "~/utils/helpers";
import InstructorLessons from "./InstructorLessons";
import StudentLessons from "./StudentLessons";

const Lessons = () => {
  const { userGlobal } = useAuth();

  return (
    <>
      {userGlobal?.role === UserRole.INSTRUCTOR && <InstructorLessons />}
      {userGlobal?.role === UserRole.STUDENT && <StudentLessons />}
    </>
  );
};

export default Lessons;
