// services/chatService.ts

import { prisma } from "../src/utils/prisma";
import { Chats_ChatType } from "@prisma/client";

export async function getOrCreatePrivateChat(currentUserId: number, otherUserId: number) {
  if (currentUserId === otherUserId) {
    return null;
  }

  const existingChat = await prisma.chats.findFirst({
    where: {
      ChatType: "private",
      UsersInChats: {
        some: { userId: currentUserId },
      },
      AND: {
        UsersInChats: {
          some: { userId: otherUserId },
        },
      },
    },
    include: {
      UsersInChats: { include: { User: true } },
      MessagesInChats: {
        include: { User: true, ImagesInMessages: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (existingChat) {
    return existingChat;
  }

  // Заглушка
  return {
    id: -1,
    ChatType: "private" as Chats_ChatType,
    name: "",
    picpath: "",
    UsersInChats: [
      {
        userId: currentUserId,
        User: await prisma.user.findUnique({ where: { id: currentUserId } }),
      },
      {
        userId: otherUserId,
        User: await prisma.user.findUnique({ where: { id: otherUserId } }),
      },
    ],
    MessagesInChats: [],
  };
}

export async function createPrivateChat(currentUserId: number, otherUserId: number) {
  const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } });
  const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
  if (!otherUser || !currentUser) throw new Error("User not found");

  const chat = await prisma.chats.create({
    data: {
      ChatType: "private",
      name: "Private Chat",
      UsersInChats: {
        create: [
          { userId: currentUserId },
          { userId: otherUserId },
        ],
      },
    },
    include: {
      UsersInChats: { include: { User: true } },
      MessagesInChats: {
        include: { User: true, ImagesInMessages: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return chat;
}

async function someUploadFunction(base64img: string) {
  // Заглушка для загрузки
  return { picpath: "uploads/messages/test.jpg", bucketkey: "someKey" };
}

export async function addMessageToChat(chatId: number, userId: number, message: string, imagesBase64: string[] = []) {
  const newMessage = await prisma.messagesInChats.create({
    data: {
      userId,
      chatId,
      message,
    },
  });

  for (const base64img of imagesBase64) {
    const { picpath, bucketkey } = await someUploadFunction(base64img);
    await prisma.imagesInMessages.create({
      data: {
        messageId: newMessage.id,
        picpath,
        bucketkey,
      },
    });
  }

  const updatedChat = await prisma.chats.findUnique({
    where: { id: chatId },
    include: {
      UsersInChats: { include: { User: true } },
      MessagesInChats: {
        include: { User: true, ImagesInMessages: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return updatedChat;
}

export async function getPaginatedMessages(chatId: number, page: number, limit: number) {
  const messages = await prisma.messagesInChats.findMany({
    where: { chatId },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      User: true,
      ImagesInMessages: true,
    },
  });
  return messages;
}
