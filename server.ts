// server.ts

import express from "express";
import next from "next";
import http from "http";
import { Server } from "socket.io";
const cookie = require("cookie");
import dotenv from "dotenv";
dotenv.config();

import { verifyToken } from "./src/utils/jwt";
import {
  getChatById,
  getChatDetails,
  getChatMessages,
  getChatsForUser,
  handleNewMessage,
} from "./services/chatService";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

declare global {
  var io: Server;
}

app.prepare().then(() => {
  const expressApp = express();
  const server = http.createServer(expressApp);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  global.io = io;

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    const cookies = socket.handshake.headers?.cookie;

    if (!cookies) {
      console.log("No cookies found in headers.");
      socket.disconnect(true);
      return;
    }

    let token;
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

    socket.on("getChats", async () => {
      const userId = parseInt(socket.data.userId);

      try {
        const chats = await getChatsForUser(userId);
        socket.emit("chatsList", chats);
      } catch (error) {
        console.error("Error getting chats:", error);
        socket.emit("error", "Failed to fetch chat list.");
      }
    });

    socket.on("getChat", async (chatId) => {
      try {
        const chat = await getChatById(parseInt(chatId), socket.data.userId);
        socket.emit("chat", chat);
      } catch (error) {
        console.error("Error getting chat:", error);
        socket.emit("error", "Failed to fetch chat.");
      }
    });

    socket.on("getChatDetails", async (chatId) => {
      try {
        const chatDetails = await getChatDetails(
          Number(chatId),
          socket.data.userId
        );
        socket.emit("chatDetails", chatDetails);
      } catch (error) {
        console.error("Error fetching chat details:", error);
        socket.emit("error", "Failed to fetch chat details.");
      }
    });

    socket.on("getChatMessages", async ({ chatId, page, limit }) => {
      try {
        console.log(
          `Request to get chat messages: chatId=${chatId}, page=${page}, limit=${limit}`
        );
        const messages = await getChatMessages(
          Number(chatId),
          Number(page),
          Number(limit)
        );
        console.log(
          `Отправка ${messages.length} сообщений для страницы ${page}`
        );
        socket.emit("chatMessages", messages);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
        socket.emit("error", "Failed to fetch chat messages.");
      }
    });

    socket.on("joinChat", (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`User ${socket.data.userId} joined chat ${chatId}`);
    });

    socket.on("newMessage", async (data) => {
      try {
        await handleNewMessage(socket, data);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "Failed to send message.");
      }
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
