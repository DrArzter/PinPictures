import React, { useState } from 'react';

export default function ChatList({ chats, user } : any) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter((chat : any) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-500 text-white"
        />
      <div className="flex flex-col gap-2">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat : any) => (
            <div
              key={chat.id}
              className="bg-gray-500 bg-opacity-30 hover:bg-opacity-50 cursor-pointer rounded-md text-center flex flex-row gap-2"
            >
              <img className="w-12 h-12 rounded-full" src={chat?.image} alt={chat.name} />
              <div>
                <p className="font-bold text-left">{chat.name}</p>
                {chat?.lastMessage ? (
                  <p>
                    {chat?.lastMessage?.author}: {chat?.lastMessage?.message}
                  </p>
                ) : (
                  'no messages yet'
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No chats found</p>
        )}
      </div>
    </div>
  );
}
