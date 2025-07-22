import { useCallback, useEffect, useState } from "react";
import useAxiosPrivate from "~/axios/useAxiosPrivate";
import { socketConfig } from "~/sockets/socket";
import { useAuth } from "~/utils/helpers";
import { Message } from "~/utils/types/message.type";
import { StudentChatRoom } from "~/utils/types/student-chatroom.type";

const StudentChatPage = () => {
  const [currentChat, setCurrentChat] = useState<StudentChatRoom | null>(null);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const { userGlobal } = useAuth();

  const fetchStudentChatRoom = useCallback(async () => {
    try {
      const studentChatResponse = await axiosPrivate.get("/studentChatRoom");
      const chatRoomData = studentChatResponse?.data?.data;
      setCurrentChat(chatRoomData || null);
      console.log("Current chat room:", chatRoomData);
      const messageResponse = await axiosPrivate.get(
        `/messages?chatId=${chatRoomData?.id}`
      );
      setMessageList(messageResponse?.data?.data || []);
      scrollMessageList();

      // setup socket connection
      if (socketConfig.connected) {
        socketConfig.emit("register", userGlobal?.id);
      }

      // Receive a message
      socketConfig.on(
        "private_message",
        ({ from, content, to, conversationId }) => {
          console.log("Received private message:", {
            from,
            content,
            to,
            conversationId,
          });
          if (chatRoomData?.id === conversationId) {
            addNewMessage({ content, from, to });
          }
        }
      );
    } catch (error) {
      console.error("Failed to fetch chat list", error);
    }
  }, []);

  // Fetch chat list
  useEffect(() => {
    fetchStudentChatRoom();

    return () => {
      socketConfig.off("connect");
      socketConfig.off("private_message");
    };
  }, [userGlobal?.id]);

  const addNewMessage = ({
    content,
    from,
    to,
  }: {
    content: string;
    from: string;
    to: string;
  }) => {
    setMessageList((prev) => [...prev, { content, from, to }]);
    scrollMessageList();
  };

  const scrollMessageList = () => {
    const messageListElement = document.getElementById("message-list");
    if (messageListElement) {
      setTimeout(() => {
        //scroll smoothly
        messageListElement.scrollTo({
          top: messageListElement.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentChat || !inputMessage.trim()) return;
    console.log("student sending message", {
      to: currentChat.owner,
      from: userGlobal?.id,
      content: inputMessage,
      conversationId: currentChat.id,
    });
    try {
      socketConfig.emit("private_message", {
        to: currentChat?.owner,
        from: userGlobal?.id,
        content: inputMessage,
        conversationId: currentChat?.id,
      });
      addNewMessage({
        content: inputMessage,
        from: userGlobal?.id,
        to: currentChat.owner,
      });
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="flex flex-row flex-grow overflow-hidden">
      {/* chat window */}
      {currentChat && (
        <div className="flex-1 p-4 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Chat with {currentChat.ownerName || "Instructor"}
            </h2>
          </div>

          {/* Scrollable messages */}
          <div
            className="flex-1 overflow-y-auto bg-white p-4 rounded-lg"
            id="message-list"
          >
            {messageList?.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg w-2/5 ${
                  message?.from === userGlobal?.id
                    ? "bg-blue-200 ml-auto"
                    : "bg-gray-200"
                }`}
              >
                <p className="text-sm">{message?.content}</p>
              </div>
            ))}
            {messageList?.length === 0 && (
              <p className="text-gray-500">No messages yet</p>
            )}
          </div>

          {/* Fixed input at bottom */}
          <form
            className="mt-4 flex items-center gap-2"
            onSubmit={handleSendMessage}
          >
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentChatPage;
