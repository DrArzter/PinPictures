// ./app/components/chat/Chat.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ClientSelfUser, FullChat, MessageInChat } from "@/app/types/global";
import LoadingIndicator from "../common/LoadingIndicator";
import { Socket } from "socket.io-client";
import { FaRegFileImage } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";

interface ChatProps {
  user: ClientSelfUser;
  chat: FullChat | undefined;
  isActiveChatLoading: boolean;
  socket: Socket | undefined;
  otherUserId?: number;
  setSelectedChatId: (id: string | undefined) => void;
}

const MESSAGES_PER_PAGE = 20;

export default function Chat({
  user,
  chat: currentChat,
  isActiveChatLoading,
  socket,
  otherUserId,
  setSelectedChatId
}: ChatProps) {
  const [newMessage, setNewMessage] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<MessageInChat[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentChat && currentChat.MessagesInChats) {
      const initialMessages = currentChat.MessagesInChats;
      setMessages(initialMessages);

      // If there are fewer messages than MESSAGES_PER_PAGE, there's nothing more to load
      setHasMore(initialMessages.length === MESSAGES_PER_PAGE);
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [currentChat]);

  useEffect(() => {
    if (
      !socket ||
      !currentChat ||
      (currentChat.id === -1 &&
        currentChat.UsersInChats.some(
          (user: { userId: number }) => user.userId === otherUserId
        )) // TODO: fix this
    )
      return;

    socket.emit("joinChat", currentChat.id);

    socket.on("newMessage", (newMsg: MessageInChat) => {
      if (
        newMsg.chatId === currentChat.id &&
        !messages.some((msg) => msg.id === newMsg.id)
      ) {
        setMessages((prev) => [...prev, newMsg]);
        scrollToBottom();
      }
    });

    socket.on("chatMessages", (fetchedMessages: MessageInChat[]) => {
      if (fetchedMessages.length === 0) {
        setHasMore(false);
      } else {
        // fetchMoreMessages was called, so we're loading old messages
        // On the server they come in DESC order, let's reverse them back
        const reversedFetched = [...fetchedMessages].reverse();
        setMessages((prev) => [...reversedFetched, ...prev]);
        setPage((prevPage) => prevPage + 1);

        if (fetchedMessages.length < MESSAGES_PER_PAGE) {
          setHasMore(false);
        }
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("chatMessages");
    };
  }, [socket, currentChat]);

  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        top: scrollableDivRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newMessage.trim() && imageFiles.length === 0) {
      alert("Please enter a message or select an image.");
      return;
    }

    if (socket && currentChat) {
      let imagesBase64: string[] = [];

      if (imageFiles.length > 0) {
        try {
          imagesBase64 = await Promise.all(
            imageFiles.map((file) => convertFileToBase64(file))
          );
        } catch (error) {
          console.error("Error converting images to Base64:", error);
          alert("Failed to process images.");
          return;
        }
      }

      const messageData =
        currentChat.id === -1
          ? {
              otherUserId: otherUserId,
              message: newMessage.trim(),
              images: imagesBase64,
            }
          : {
              chatId: currentChat.id,
              message: newMessage.trim(),
              images: imagesBase64,
            };

      socket.emit("newMessage", messageData);

      setNewMessage("");
      setImageFiles([]);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject("Failed to convert file to Base64.");
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const fetchMoreMessages = () => {
    if (!socket || !currentChat || currentChat.id === -1) {
      setHasMore(false);
      return;
    }

    socket.emit("getChatMessages", {
      chatId: currentChat.id,
      page: page + 1,
      limit: MESSAGES_PER_PAGE,
    });
  };

  if (isActiveChatLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingIndicator />
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="rounded-xl px-2 py-1">
          <span>No chat selected</span>
        </div>
      </div>
    );
  }

  // Determine chat name and avatar
  let chatName = currentChat.name;
  let chatAvatar = currentChat.picpath;

  if (currentChat.ChatType === "private") {
    // Find the other participant
    const otherParticipant = currentChat.UsersInChats.find(
      (uic) => uic.userId !== user.id
    );
    if (otherParticipant && otherParticipant.User) {
      chatName = otherParticipant.User.name;
      chatAvatar = otherParticipant.User.avatar;
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex flex-row items-center gap-4 mb-4 border-b pb-4">
        
      <button
            onClick={() => {
              console.log(setSelectedChatId(undefined));
            }}
            className=""
            aria-label="Close Chat"
          >
            <IoIosArrowBack className="w-6 h-6" />
          </button>
        {chatAvatar && (
          <img
            src={chatAvatar}
            alt="Chat Avatar"
            className="w-12 h-12 rounded-full"
          />
        )}
        <span className="text-xl font-semibold">{chatName}</span>
      </div>

      {/* Message List */}
      <div
        id="scrollableChat"
        ref={scrollableDivRef}
        className="flex-grow overflow-auto border p-2"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          loader={<LoadingIndicator />}
          inverse={true}
          scrollableTarget="scrollableChat"
        >
          {messages.map((message, index) => {
            const isCurrentUser = message.User.id === user.id;
            const previousMessage = messages[index - 1];
            const showAuthorInfo =
              index === 0 || message.User.name !== previousMessage?.User?.name;

            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`flex flex-col ${
                    isCurrentUser ? "items-end" : "items-start"
                  } max-w-xs`}
                >
                  {showAuthorInfo && (
                    <div className="flex items-center mb-1">
                      {!isCurrentUser && message.User && (
                        <img
                          src={message.User.avatar}
                          alt="Message Author Avatar"
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      )}
                      <span className="text-sm font-semibold">
                        {isCurrentUser
                          ? "You"
                          : message.User?.name || "Unknown"}
                      </span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isCurrentUser
                        ? "bg-zinc-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    <p>{message.message}</p>
                    {message.imagesInMessages &&
                      message.imagesInMessages.length > 0 &&
                      message.imagesInMessages.map((image, imgIndex) => (
                        <div key={imgIndex} className="h-40 w-40 mt-2">
                          <Image
                            key={imgIndex}
                            src={image.picpath}
                            alt="Message Image"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>

      {/* Message Send Form */}
      <form onSubmit={handleSendMessage} className="mt-4">
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="flex w-full">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border rounded-l w-full p-2 text-base outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter a message..."
            />
            <label className="flex items-center bg-gray-300 px-4 cursor-pointer">
              <FaRegFileImage className="text-2xl text-gray-500" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <button
              type="submit"
              className="bg-yellow-500 text-white font-semibold rounded-r px-4"
            >
              Send
            </button>
          </div>
          {imageFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-75 hover:opacity-100 transition duration-300"
                  >
                    <MdClose size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
