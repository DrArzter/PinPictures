import React from "react";

export default function ChatList({ user, chat } : any) {
  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-gray-500 rounded-xl px-2 py-1">
        Choose a chat to start a conversation
        </div>
      </div>
    );
  }
  return <div></div>;
}
