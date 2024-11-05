import React from "react";

export default function Chats({ windowHeight, windowWidth, windowId, user }) {
  return (
    <div
      style={{ height: `${windowHeight - 55}px`, width: `${windowWidth}px` }}
      className="flex flex-col items-center justify-center scrollbar-hidden"
    >
      Chats
    </div>
  );
}
