// services/chatService.ts

import { prisma } from "../src/utils/prisma";
import { UsersInChats, User } from "@prisma/client";
import { Socket } from "socket.io";
import { uploadFiles } from "../src/utils/s3Module";

interface NewMessageData {
  chatId: number;
  message: string;
  images?: string[];
}

export async function handleNewMessage(socket: Socket, data: any) {
  try {
    const userId = socket.data.userId;
    const { chatId, message, images } = data;

    if (!chatId || (!message.trim() && (!images || images.length === 0))) {
      socket.emit("error", "Chat ID and message or images are required.");
      return;
    }

    const newMessage = await prisma.messagesInChats.create({
      data: {
        chatId: chatId,
        userId: userId,
        message: message.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        images: true,
      },
    });

    let completeMessage = newMessage;

    if (images && images.length > 0) {
      const filesToUpload = [];

      for (const image of images) {
        const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!matches) {
          socket.emit("error", "Invalid image format.");
          return;
        }
        const mimeType = matches[1];
        const imageData = matches[2];
        const buffer = Buffer.from(imageData, "base64");
        const extension = mimeType.split("/")[1];

        const filename = `messages/${newMessage.id}-${Date.now()}.${extension}`;

        filesToUpload.push({
          filename: filename,
          content: buffer,
        });
      }

      const uploadResult = await uploadFiles(filesToUpload);

      if (!uploadResult || uploadResult.length === 0) {
        socket.emit("error", "Failed to upload images.");
        return;
      }

      for (const uploadedImage of uploadResult) {
        await prisma.imagesInMessages.create({
          data: {
            messageId: newMessage.id,
            picpath: uploadedImage.Location,
            bucketkey: uploadedImage.Key,
          },
        });
      }

      const foundMessage = await prisma.messagesInChats.findUnique({
        where: { id: newMessage.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          images: {
            select: {
              id: true,
              picpath: true,
              messageId: true,
              bucketkey: true,
            },
          },
        },
      });

      if (!foundMessage) {
        throw new Error("Message not found after creation.");
      }

      completeMessage = foundMessage;
    }

    global.io.to(`chat_${chatId}`).emit("newMessage", completeMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    socket.emit("error", "Failed to send message.");
  }
}

export async function getChatsForUser(userId: number) {
  try {
    const chats = await prisma.chats.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            author: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    const getInterlocutorName = (
      usersInChat: Array<UsersInChats & { user: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.user?.name || "Unknown";
    };

    const getInterlocutorAvatar = (
      usersInChat: Array<UsersInChats & { user: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.user?.avatar || "default-avatar-url";
    };

    // Форматирование полученных чатов
    const formattedChats = chats.map((chat) => {
      const lastMessage = chat.messages[0];
      const isGroupChat = chat.ChatType === "group";

      return {
        id: chat.id,
        name: isGroupChat ? chat.name : getInterlocutorName(chat.users, userId),
        avatar: isGroupChat
          ? chat.picpath
          : getInterlocutorAvatar(chat.users, userId),
        lastMessage: lastMessage
          ? {
              message: lastMessage.message,
              createdAt: lastMessage.createdAt,
              author: {
                name: lastMessage.author?.name || "Unknown",
                avatar: lastMessage.author?.avatar || "default-avatar-url",
              },
            }
          : null,
      };
    });

    return formattedChats;
  } catch (error) {
    console.error("Error fetching chats for user:", error);
    throw error;
  }
}

export async function getChatById(chatId: number, userId: number) {
  try {
    const chat = await prisma.chats.findUnique({
      where: { id: chatId },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            author: {
              select: {
                name: true,
                avatar: true,
              },
            },
            images: {
              select: {
                id: true,
                picpath: true,
              },
            },
          },
        },
      },
    });

    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found.`);
    }

    const getInterlocutorName = (
      usersInChat: Array<UsersInChats & { user: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.user?.name || "Unknown";
    };

    const getInterlocutorAvatar = (
      usersInChat: Array<UsersInChats & { user: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.user?.avatar || "default-avatar-url";
    };

    const isGroupChat = chat.ChatType === "group";

    const formattedChat = {
      id: chat.id,
      name: isGroupChat ? chat.name : getInterlocutorName(chat.users, userId),
      avatar: isGroupChat
        ? chat.picpath
        : getInterlocutorAvatar(chat.users, userId),
      users: chat.users.map((u) => ({
        id: u.user.id,
        name: u.user.name,
        avatar: u.user.avatar,
      })),
      messages: chat.messages.map((msg) => ({
        id: msg.id,
        message: msg.message,
        createdAt: msg.createdAt,
        author: {
          name: msg.author?.name || "Unknown",
          avatar: msg.author?.avatar || "default-avatar-url",
        },
        images: msg.images.map((image) => ({
          id: image.id,
          picpath: image.picpath,
        })),
      })),
    };

    return formattedChat;
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    throw error;
  }
}

export async function getChatDetails(chatId: number, userId: number) {
  try {
    if (!chatId) throw new Error("Chat ID is required");

    const chat = await prisma.chats.findUnique({
      where: { id: chatId },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found.`);
    }

    const getInterlocutorName = (
      usersInChat: Array<UsersInChats & { user: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.user?.name || "Unknown";
    };

    const getInterlocutorAvatar = (
      usersInChat: Array<UsersInChats & { user: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.user?.avatar || "default-avatar-url";
    };

    const isGroupChat = chat.ChatType === "group";

    return {
      id: chat.id,
      name: isGroupChat ? chat.name : getInterlocutorName(chat.users, userId),
      avatar: isGroupChat
        ? chat.picpath
        : getInterlocutorAvatar(chat.users, userId),
      users: chat.users.map((u) => ({
        id: u.user.id,
        name: u.user.name,
        avatar: u.user.avatar,
      })),
    };
  } catch (error) {
    console.error("Error fetching chat details:", error);
    throw error;
  }
}

// Постраничная загрузка сообщений
export async function getChatMessages(
  chatId: number,
  page: number,
  limit: number
) {
  try {
    if (!chatId) throw new Error("Chat ID is required");

    const offset = (page - 1) * limit;

    const messages = await prisma.messagesInChats.findMany({
      where: { chatId },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
        images: {
          select: {
            id: true,
            picpath: true,
          },
        },
      },
    });

    return messages.reverse();
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
}
