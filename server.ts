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
  sayGex,
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

    socket.on("joinChat", (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`User ${socket.data.userId} joined chat ${chatId}`);
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