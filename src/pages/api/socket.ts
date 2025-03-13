// /pages/api/socket.ts
/* eslint-disable no-var */
import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import * as cookie from "cookie";
import dotenv from "dotenv";
import { Socket } from "net";
dotenv.config();

import { verifyToken } from "../../utils/jwt";
import { prisma } from "../../utils/prisma";
import {
  getOrCreatePrivateChat,
  createPrivateChat,
  addMessageToChat,
  getPaginatedMessages,
} from "../../../services/chatService";

import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

interface SocketWithIO extends Socket {
  server: NetServer & {
    io?: SocketIOServer;
  };
}

interface ResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

declare global {
  var io: SocketIOServer;
}

export default async function handler(
  req: NextApiRequest,
  res: ResponseWithSocket
) {
  if (!res.socket) {
    res.status(500).json({ error: "Socket not available" });
    return;
  }

  // Initialize global socket if it hasn't been created yet
  if (!global.io) {
    console.log("Initializing Socket.io");

    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*", // In production, replace with specific domain
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Setup Redis adapter (if used)
    const pubClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      password: process.env.REDIS_PASSWORD,
    });
    const subClient = pubClient.duplicate();

    try {
      await Promise.all([pubClient.connect(), subClient.connect()]);
      io.adapter(createAdapter(pubClient, subClient));
    } catch (error) {
      console.error("Redis connection error:", error);
    }

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      const cookies = socket.handshake.headers?.cookie;
      if (!cookies) {
        console.log("No cookies found in headers.");
        socket.disconnect(true);
        return;
      }

      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.token;
      if (!token) {
        console.log("No token found in cookies.");
        socket.disconnect(true);
        return;
      }

      try {
        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) {
          console.log("Invalid token.");
          socket.disconnect(true);
          return;
        }

        socket.data.userId = decoded.userId;
        socket.join(`user_${socket.data.userId}`);
        console.log(`User ${socket.data.userId} joined their personal room.`);
      } catch (error) {
        console.error("Token verification error:", error);
        socket.disconnect(true);
        return;
      }

      socket.on("getOrCreatePrivateChat", async (otherUserId: number) => {
        const currentUserId = socket.data.userId;
        try {
          const chat = await getOrCreatePrivateChat(currentUserId, otherUserId);
          if (!chat) {
            socket.emit("chat", { error: "Cannot create chat with yourself" });
            return;
          }
          socket.emit("chat", chat);
        } catch (error) {
          console.error(error);
          socket.emit("chat", { error: "Something went wrong" });
        }
      });

      socket.on(
        "newMessage",
        async (data: {
          chatId?: number;
          otherUserId?: number;
          message: string;
          images: string[];
        }) => {
          const { chatId, otherUserId, message, images } = data;
          const currentUserId = socket.data.userId;
          try {
            let finalChatId = chatId;
            let chat;

            if ((finalChatId === -1 || !finalChatId) && otherUserId) {
              const newChat = await createPrivateChat(
                currentUserId,
                otherUserId
              );
              finalChatId = newChat.id;
              chat = await addMessageToChat(
                finalChatId,
                currentUserId,
                message,
                images
              );

              if (chat) {
                socket.emit("chat", chat);

                for (const uic of chat.UsersInChats) {
                  if (uic.userId !== currentUserId) {
                    const newCreatedChat = await prisma.chats.findUnique({
                      where: { id: finalChatId },
                      include: {
                        UsersInChats: { include: { User: true } },
                        MessagesInChats: {
                          include: { User: true, ImagesInMessages: true },
                          orderBy: { createdAt: "asc" },
                        },
                      },
                    });

                    const cLastMessage = {
                      id: newCreatedChat?.MessagesInChats[0]?.id,
                      message: newCreatedChat?.MessagesInChats[0]?.message,
                      User: {
                        id: newCreatedChat?.MessagesInChats[0]?.User?.id,
                        name: newCreatedChat?.MessagesInChats[0]?.User?.name,
                        avatar:
                          newCreatedChat?.MessagesInChats[0]?.User?.avatar,
                      },
                    };

                    const formatedChat = {
                      ChatType: newCreatedChat?.ChatType,
                      avatar: newCreatedChat?.UsersInChats[0]?.User?.avatar,
                      id: newCreatedChat?.id,
                      name: newCreatedChat?.UsersInChats[0]?.User?.name,
                      UsersInChats: newCreatedChat?.UsersInChats.map((uic) => ({
                        id: uic.userId,
                        name: uic.User.name,
                        avatar: uic.User.avatar,
                      })),
                      lastMessage: cLastMessage,
                    };
                    io.to(`user_${uic.userId}`).emit("newChat", formatedChat);
                  }
                }

                const newMsg =
                  chat.MessagesInChats[chat.MessagesInChats.length - 1];
                io.to(`chat_${finalChatId}`).emit("newMessage", newMsg);
              }
            } else {
              if (!finalChatId) {
                throw new Error("No chatId provided");
              }
              chat = await addMessageToChat(
                finalChatId,
                currentUserId,
                message,
                images
              );

              if (chat) {
                const newMsg =
                  chat.MessagesInChats[chat.MessagesInChats.length - 1];
                io.to(`chat_${finalChatId}`).emit("newMessage", newMsg);
              }
            }
          } catch (error) {
            console.error(error);
            socket.emit("errorMessage", { error: "Failed to send message" });
          }
        }
      );

      socket.on("getChatMessages", async ({ chatId, page, limit }) => {
        const currentUserId = socket.data.userId;
        const isMember = await prisma.usersInChats.findFirst({
          where: {
            chatId,
            userId: currentUserId,
          },
        });
        if (!isMember) {
          socket.emit("chatMessages", []);
          return;
        }

        const fetchedMessages = await getPaginatedMessages(chatId, page, limit);
        socket.emit("chatMessages", fetchedMessages);
      });

      socket.on("joinChat", (chatId) => {
        socket.join(`chat_${chatId}`);
        console.log(`User ${socket.data.userId} joined chat ${chatId}`);  
      });

      socket.on("getUserChats", async () => {
        const currentUserId = socket.data.userId;
        const userChats = await prisma.chats.findMany({
          where: {
            UsersInChats: {
              some: {
                userId: currentUserId,
              },
            },
          },
          include: {
            UsersInChats: { include: { User: true } },
            MessagesInChats: {
              include: { User: true, ImagesInMessages: true },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });

        const chatsForClient = userChats.map((chat) => {
          const lastMessage = chat.MessagesInChats[0] || null;
          let name = chat.name;
          let avatar = chat.picpath;

          if (chat.ChatType === "private") {
            const otherUserInChat = chat.UsersInChats.find(
              (uic) => uic.userId !== currentUserId
            )?.User;
            if (otherUserInChat) {
              name = otherUserInChat.name;
              avatar = otherUserInChat.avatar;
            }
          }

          return {
            id: chat.id,
            name,
            ChatType: chat.ChatType,
            avatar,
            UsersInChats: chat.UsersInChats.map((uic) => ({
              id: uic.userId,
              name: uic.User.name,
              avatar: uic.User.avatar,
            })),
            lastMessage: lastMessage
              ? {
                  id: lastMessage.id,
                  message: lastMessage.message,
                  User: {
                    id: lastMessage.User.id,
                    name: lastMessage.User.name,
                    avatar: lastMessage.User.avatar,
                  },
                }
              : null,
          };
        });

        socket.emit("userChats", chatsForClient);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    io.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    global.io = io;
  } else {
    console.log("Socket.io is already running");
  }

  res.end();
}
