// server.ts
import express from "express";
import next from "next";
import http from "http";
import { Server } from "socket.io";
const cookie = require("cookie");
import dotenv from "dotenv";
dotenv.config();

import { verifyToken } from "./src/utils/jwt";
import { getChatsForUser } from "./services/chatService";
import { acceptFriendRequest, addFriend } from "./services/friendService";

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

    socket.on("newMessage", (data) => {
      io.emit("newMessage", data);
    });

    // Обработчик запроса на добавление в друзья
    socket.on("addFriend", async ({ friendId }) => {
      try {
        await addFriend(socket.data.userId, friendId, io);
      } catch (error) {
        console.error("Error adding friend:", error);
      }
    });

    socket.on("acceptFriendRequest", async ({ friendId }) => {
      try {
        await acceptFriendRequest(socket.data.userId, friendId, io);
      } catch (error) {
        console.error("Error accepting friend request:", error);
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
