// services/chatService.ts

import { prisma } from "../src/utils/prisma";
import { UsersInChats, User, Chats } from "@prisma/client";
import { Socket } from "socket.io";
import { uploadFiles } from "../src/utils/s3Module";

function sayGex(){
  console.log("gex")
}