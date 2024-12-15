import { AdminChat } from "@/app/types/global";

interface ChatListItemProps {
  chat: AdminChat;
  selectedChatId: string | undefined;
  handleChatClick: (chat: AdminChat) => void;
}

export default function ChatListItem({
  chat,
  selectedChatId,
  handleChatClick,
}: ChatListItemProps) {
  
  return (
    <div
      key={chat.id}
      onClick={() => handleChatClick(chat)}
      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-yellow-500 transition-colors ${
        selectedChatId === chat.id.toString()
          ? "border-l-4 border-yellow-500"
          : ""
      }`}
    >
      <div className="flex-shrink-0">
        {chat.avatar ? (
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={chat.avatar}
            alt={chat.name}
          />
        ) : (
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            <span className="text-xl">{chat.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="ml-4 flex-1 flex flex-col justify-center">
        <span className="text-lg font-semibold">{chat.name}</span>
        <span className="text-sm">
          {chat.lastMessage
            ? `${chat.lastMessage.User.name}: ${chat.lastMessage.message}`
            : "No messages"}
        </span>
      </div>
    </div>
  );
}
