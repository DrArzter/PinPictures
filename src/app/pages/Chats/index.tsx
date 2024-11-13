// components/Chats.js
import React, { useEffect, useState } from "react";
import { useSocketContext } from "@/app/contexts/SocketContext";
import { User } from "@/app/types/global";

import ChatList from "@/app/components/ChatList";
import Chat from "@/app/components/Chat";

interface ChatsProprs {
  windowHeight: number;
  windowWidth: number;
  windowId: number;
  user: User;
}

export default function Chats({
  windowHeight,
  windowWidth,
  windowId,
  user,
}: ChatsProprs) {
  const { socket } = useSocketContext();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    if (socket) {
      // Emit an event to request chats data
      socket.emit("getChats");

      // Listen for the response from the server
      socket.on("chatsData", (data) => {
        console.log("Received chats data:", data);
        setChats(data); // Update state with received chats
      });

      // Cleanup the listener on unmount to prevent memory leaks
      return () => {
        socket.off("chatsData");
      };
    }
  }, [socket]);

  return (
    <div
      style={{ height: `${windowHeight - 55}px`, width: `${windowWidth}px` }}
      className="flex flex-col items-center justify-center scrollbar-hidden p-4"
    >
      <div className="flex flex-row w-full h-full gap-2">
        <div
          style={{ width: `${(windowWidth / 12) * 3}px` }}
          className="rounded-2xl bg-gray-800 p-2"
        >
          <ChatList chats={chats} user={user} />
        </div>
        <div
          style={{ width: `${(windowWidth / 12) * 9}px` }}
          className="p-2 rounded-2xl bg-gray-800 "
        >
          <Chat user={user} chat={activeChat} />
        </div>
      </div>
    </div>
  );
}
