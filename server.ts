// server.ts

import express from "express";
import next from "next";
import http from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
const cookie = require("cookie");
import dotenv from "dotenv";
dotenv.config();

import { verifyToken } from "./src/utils/jwt";
import { prisma } from "./src/utils/prisma";
import {
  getOrCreatePrivateChat,
  createPrivateChat,
  addMessageToChat,
  getPaginatedMessages,
} from "./services/chatService";



const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

declare global {
  var io: Server;
}

app.prepare().then(async () => {
  const expressApp = express();
  const server = http.createServer(expressApp);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Настройка Redis-клиентов
  const pubClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  // Установка Redis-адаптера для Socket.IO
  io.adapter(createAdapter(pubClient, subClient));

  global.io = io;

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    const cookies = socket.handshake.headers?.cookie;

    if (!cookies) {
      console.log("No cookies found in headers.");
      socket.disconnect(true);
      return;
    }

    let token: string;
    try {
      const parsedCookies = cookie.parse(cookies);
      token = parsedCookies.token;

      if (!token) {
        console.log("No token found in cookies.");
        socket.disconnect(true);
        return;
      }
    } catch (error) {
      console.error("Error parsing cookies:", error);
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

    // Получить или создать приватный чат
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

    // Новое сообщение
    socket.on("newMessage", async (data: { chatId?: number; otherUserId?: number; message: string; images: string[] }) => {
      const { chatId, otherUserId, message, images } = data;
      const currentUserId = socket.data.userId;
      try {
        let finalChatId = chatId;
        let chat;

        if ((finalChatId === -1 || !finalChatId) && otherUserId) {
          // Создаём приватный чат
          const newChat = await createPrivateChat(currentUserId, otherUserId);
          finalChatId = newChat.id;
          chat = await addMessageToChat(finalChatId, currentUserId, message, images);

          if (chat) {
            // Отправляем полный чат отправителю (чтобы заменить заглушку -1 на реальный чат)
            socket.emit("chat", chat);

            // Второму пользователю отправляем newChat, чтобы у него появился чат в списке
            for (const uic of chat.UsersInChats) {
              if (uic.userId !== currentUserId) {
                const newChat = await prisma.chats.findUnique({
                  where: { id: finalChatId },
                  include: {
                    UsersInChats: { include: { User: true } },
                    MessagesInChats: {
                      include: { User: true, ImagesInMessages: true },
                      orderBy: { createdAt: "asc" },
                    },
                  },
                });

                const cLastMesage = {
                  id: newChat?.MessagesInChats[0]?.id,
                  message: newChat?.MessagesInChats[0]?.message,
                  User: {
                    id: newChat?.MessagesInChats[0]?.User?.id,
                    name: newChat?.MessagesInChats[0]?.User?.name,
                    avatar: newChat?.MessagesInChats[0]?.User?.avatar,
                  },
                }

                const formatedChat = {
                  ChatType: newChat?.ChatType,
                  avatar: newChat?.UsersInChats[0]?.User?.avatar,
                  id: newChat?.id,
                  name: newChat?.UsersInChats[0]?.User?.name,
                  UsersInChats: newChat?.UsersInChats.map((uic) => ({
                    id: uic.userId,
                    name: uic.User.name,
                    avatar: uic.User.avatar,
                  })),
                  lastMessage: cLastMesage,
                }
                io.to(`user_${uic.userId}`).emit("newChat", formatedChat);
              }
            }

            const newMsg = chat.MessagesInChats[chat.MessagesInChats.length - 1];
            io.to(`chat_${finalChatId}`).emit("newMessage", newMsg);
          }
        } else {
          // Чат уже существует
          if (!finalChatId) {
            throw new Error("No chatId provided");
          }
          chat = await addMessageToChat(finalChatId, currentUserId, message, images);

          if (chat) {
            const newMsg = chat.MessagesInChats[chat.MessagesInChats.length - 1];
            io.to(`chat_${finalChatId}`).emit("newMessage", newMsg);
          }
        }
      } catch (error) {
        console.error(error);
        socket.emit("errorMessage", { error: "Failed to send message" });
      }
    });

    socket.on("getChat", async (chatId: number) => {
      const currentUserId = socket.data.userId;
      const chat = await prisma.chats.findUnique({
        where: { id: chatId },
        include: {
          UsersInChats: { include: { User: true } },
          MessagesInChats: {
            include: { User: true, ImagesInMessages: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });
      if (chat && chat.UsersInChats.some((uic) => uic.userId === currentUserId)) {
        socket.emit("chat", chat);
      } else {
        socket.emit("chat", { error: "You are not part of this chat" });
      }
    });

    // Бесконечная подгрузка сообщений
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

    // Получение списка чатов пользователя
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
          const otherUserInChat = chat.UsersInChats.find(uic => uic.userId !== currentUserId)?.User;
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
          users: chat.UsersInChats.map(uic => ({
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
                  avatar: lastMessage.User.avatar
                }
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

  expressApp.all("*", (req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
