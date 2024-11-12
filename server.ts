// ./server.ts
import express from "express";
import next from "next";
import http from "http";
import { Server } from "socket.io";
const cookie = require("cookie");

import dotenv from "dotenv";
dotenv.config();

import { verifyToken } from "./src/utils/jwt";
import { getChatsForUser } from "./services/chatService";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

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

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    const cookies = socket.handshake.headers?.cookie;

    if (!cookies) {
      console.log("No cookies found.");
      socket.disconnect(true);
      return;
    }

    let token;
    try {
      const parsedCookies = cookie.parse(cookies);
      token = parsedCookies.token;
    } catch (error) {
      console.error("Error parsing cookies:", error);
      socket.disconnect(true);
      return;
    }

    if (!token) {
      console.log("No token provided.");
      socket.disconnect(true);
      return;
    }

    try {
      const decoded = verifyToken(token);

      if (!decoded || !decoded.userId) {
        console.log("Токен недействителен.");
        socket.disconnect(true);
        return;
      }

      socket.data.userId = decoded.userId;
    } catch (error) {
      console.error("Ошибка при проверке токена:", error);
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
        socket.emit("error", "Не удалось получить список чатов.");
      }
    });

    socket.on("newMessage", (data) => {
      io.emit("newMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  io.on("error", (error) => {
    console.error("Ошибка Socket.IO:", error);
  });

  expressApp.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on ${port}`);
  });
});
