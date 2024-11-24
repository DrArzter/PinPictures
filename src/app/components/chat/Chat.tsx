// src/app/components/Chat.tsx

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { User } from "@/app/types/global";
import LoadingIndicator from "../common/LoadingIndicator";
import { Socket } from "socket.io-client";
import { FaRegFileImage } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

interface ChatProps {
  user: User;
  chat: FullChat | undefined;
  isActiveChatLoading: boolean;
  socket: Socket | undefined;
}

export default function Chat({
  user,
  chat,
  isActiveChatLoading,
  socket,
}: ChatProps) {
  console.log("Chat component props:", chat);

  const [newMessage, setNewMessage] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [currentChat, setChat] = useState(chat);

  // Create a ref for the messages container
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  // Create a ref for a dummy element at the end of the messages list
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setChat(chat);
  }, [chat]);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Use useLayoutEffect for synchronous scrolling after rendering
  useLayoutEffect(() => {
    if (currentChat) {
      scrollToBottom();
    }
  }, [currentChat?.messages]);

  // Additional useEffect to scroll after all images have loaded
  useEffect(() => {
    if (currentChat) {
      const images = messagesContainerRef.current?.getElementsByTagName("img");
      if (images) {
        let loadedCount = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
          scrollToBottom();
          return;
        }

        const handleImageLoad = () => {
          loadedCount += 1;
          if (loadedCount === totalImages) {
            scrollToBottom();
          }
        };

        for (let img of images) {
          if (img.complete) {
            handleImageLoad();
          } else {
            img.addEventListener("load", handleImageLoad);
            img.addEventListener("error", handleImageLoad);
          }
        }

        // Clean up listeners on unmount or when messages change
        return () => {
          for (let img of images) {
            img.removeEventListener("load", handleImageLoad);
            img.removeEventListener("error", handleImageLoad);
          }
        };
      } else {
        scrollToBottom();
      }
    }
  }, [currentChat?.messages]);

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newMessage.trim() && imageFiles.length === 0) {
      alert("Please enter a message or select an image.");
      return;
    }

    if (socket && chat) {
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

      const messageData = {
        chatId: chat.id,
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

  useEffect(() => {
    if (socket && chat) {
      socket.emit("joinChat", chat.id);

      socket.on("newMessage", (newMessage: any) => {
        if (newMessage.chatId === chat.id) {
          setChat((prevChat) => {
            if (!prevChat) return prevChat;
            return {
              ...prevChat,
              messages: [...prevChat.messages, newMessage],
            };
          });
        }
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, chat]);

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
          <span className="text-white">No chat selected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex flex-row items-center gap-4 mb-4 border-b pb-4">
        <img
          src={currentChat.avatar}
          alt="Chat Avatar"
          className="w-12 h-12 rounded-full"
        />
        <span className="text-xl font-semibold">{currentChat.name}</span>
      </div>
      <div
        ref={messagesContainerRef}
        className="flex flex-col flex-grow overflow-y-auto"
        style={{ maxHeight: "100%", height: "100%" }}
      >
        {currentChat.messages.map((message, index) => {
          const isCurrentUser = message.author.name === user.name;
          const previousMessage = currentChat.messages[index - 1];
          const showAuthorInfo =
            index === 0 || message.author.name !== previousMessage?.author.name;

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
                    {!isCurrentUser && (
                      <img
                        src={message.author.avatar}
                        alt="Message Author Avatar"
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    )}
                    <span className="text-sm font-semibold">
                      {isCurrentUser ? "You" : message.author.name}
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
                  {message.images &&
                    message.images.length > 0 &&
                    message.images.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image.picpath}
                        alt="Message Image"
                        className="mt-2 max-w-full h-auto"
                        onLoad={() => {
                          // If this is the last image of the last message, scroll to bottom
                          if (
                            index === currentChat.messages.length - 1 &&
                            imgIndex === message.images.length - 1
                          ) {
                            scrollToBottom();
                          }
                        }}
                      />
                    ))}
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Dummy element for scrolling */}
        <div ref={messagesEndRef} />
      </div>
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
              className="btn-primary bg-yellow-500 text-white font-semibold rounded-r px-4"
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
