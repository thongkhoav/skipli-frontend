import { useCallback, useEffect, useState } from "react";
import useAxiosPrivate from "~/axios/useAxiosPrivate";
import { socketConfig } from "~/sockets/socket";
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

  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      const response = await axiosPrivate.get(`/messages?chatId=${chatId}`);
      setMessageList(response?.data?.data || []);
      scrollMessageList();
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  }, []);

  // Fetch chat list
  useEffect(() => {
    const setup = async () => {
      await fetchChatList();
      if (socketConfig.connected) {
        socketConfig.emit("register", userGlobal?.id);
      }
    };
    setup();

    return () => {
      socketConfig.off("connect");
      socketConfig.off("private_message");
    };
  }, [userGlobal?.id]);

  useEffect(() => {
    console.log("Current chat room:", currentChat);
    if (currentChat && currentChat?.id) {
      // clear private_message listener before setting a new one
      socketConfig.off("private_message");
      socketConfig.on(
        "private_message",
        ({ from, content, to, conversationId }) => {
          console.log("instructor Received private message:", {
            from,
            content,
            to,
            conversationId,
            currentChat: currentChat?.id,
          });
          if (currentChat?.id === conversationId) {
            addNewMessage({ content, from, to });
          }
        }
      );
    }
  }, [currentChat]);

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
    try {
      console.log("Sending message:", {
        to: currentChat.student.id,
        from: userGlobal?.id,
        message: inputMessage,
        conversationId: currentChat?.id,
      });
      socketConfig.emit("private_message", {
        to: currentChat.student.id,
        from: userGlobal?.id,
        content: inputMessage,
        conversationId: currentChat?.id,
      });
      addNewMessage({
        content: inputMessage,
        from: userGlobal?.id as string,
        to: currentChat.student.id,
      });
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const handleChatSelect = async (chat: InstructorChat) => {
    setCurrentChat(chat);
    await fetchMessages(chat.id);
  };

  return (
    <div className="flex flex-row flex-grow overflow-hidden">
      {/* conversation list */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">Conversations</h2>
        <ul>
          {chatList?.map((chat) => (
            <li
              key={chat.id}
              className={`p-4 cursor-pointer rounded-xl bg-slate-200 hover:bg-slate-300 mb-2 ${
                currentChat?.id === chat?.id && "bg-slate-500 text-white"
              }`}
              onClick={() => handleChatSelect(chat)}
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

export default InstructorChatPage;
