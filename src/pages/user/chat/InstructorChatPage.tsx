import { useCallback, useEffect, useState } from "react";
import useAxiosPrivate from "~/axios/useAxiosPrivate";
import { socket } from "~/sockets/socket";
import { useAuth } from "~/utils/helpers";
import { InstructorChat } from "~/utils/types/instructor-chat.type";
import { Message } from "~/utils/types/message.type";

const InstructorChatPage = () => {
  const [chatList, setChatList] = useState<InstructorChat[]>([]);
  const [currentChat, setCurrentChat] = useState<InstructorChat | null>(null);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const { userGlobal } = useAuth();

  const fetchChatList = useCallback(async () => {
    try {
      const response = await axiosPrivate.get("/chats");
      setChatList(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch chat list", error);
    }
  }, []);

  // Fetch chat list
  useEffect(() => {
    fetchChatList();

    // Register your user ID after connecting
    socket.on("connect", () => {
      socket.emit("register", userGlobal?.id);
    });

    // Receive a message
    socket.on("private_message", ({ from, content, to }) => {
      setMessageList((prev) => [...prev, { content, from, to }]);
    });

    return () => {
      socket.off("connect");
      socket.off("private_message");
    };
  }, []);

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentChat || !inputMessage.trim()) return;
    try {
      socket.emit("private_message", {
        to: currentChat.student.id,
        from: userGlobal?.id,
        message: inputMessage,
      });
      setMessageList((prev) => [
        ...prev,
        {
          content: inputMessage,
          from: userGlobal?.id,
          to: currentChat.student.id,
        },
      ]);
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="flex flex-row flex-grow overflow-hidden">
      {/* conversation list */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-4">Conversations</h2>
        <ul>
          {chatList?.map((chat) => (
            <li
              key={chat.id}
              className={`p-4 cursor-pointer rounded-xl bg-slate-200 hover:bg-slate-300 mb-2 ${
                currentChat?.id === chat?.id && "bg-slate-500 text-white"
              }`}
              onClick={() => setCurrentChat(chat)}
            >
              {chat?.student?.name}
            </li>
          ))}
        </ul>
      </div>

      {/* chat window */}
      {currentChat && (
        <div className="flex-1 p-4 flex flex-col h-full">
          {currentChat ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Chat with {currentChat.student.name}
              </h2>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                Select a conversation to start chatting
              </p>
            </div>
          )}

          {/* Scrollable messages */}
          <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg">
            {messageList.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  message.from === userGlobal?.id
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs text-gray-500">
                  {message.from === userGlobal?.id
                    ? "You"
                    : currentChat?.student.name}
                </span>
              </div>
            ))}
            {messageList.length === 0 && (
              <p className="text-gray-500">No messages yet</p>
            )}
          </div>

          {/* Fixed input at bottom */}
          <form
            className="mt-4 flex items-center gap-2"
            onSubmit={handleSendMessage}
          >
            <input
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

export default InstructorChatPage;
