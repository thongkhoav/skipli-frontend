import { UserRole } from "~/store/AuthContext";
import { useAuth } from "~/utils/helpers";
import InstructorChatPage from "./InstructorChatPage";
import StudentChatPage from "./StudentChatPage";

const ChatPage = () => {
  const { userGlobal } = useAuth();

  return (
    <>
      {userGlobal?.role === UserRole.INSTRUCTOR && <InstructorChatPage />}
      {userGlobal?.role === UserRole.STUDENT && <StudentChatPage />}
    </>
  );
};

export default ChatPage;
