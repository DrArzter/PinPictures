// services/chatService.ts

import { prisma } from "../src/utils/prisma";
import { UsersInChats, User, Chats } from "@prisma/client";
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
        User: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        ImagesInMessages: true,
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
          User: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          ImagesInMessages: {
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
        UsersInChats: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        UsersInChats: {
          include: {
            User: true,
          },
        },
        MessagesInChats: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            User: {
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
      usersInChat: Array<UsersInChats & { User: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.User?.name || "Unknown";
    };

    const getInterlocutorAvatar = (
      usersInChat: Array<UsersInChats & { User: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.User?.avatar || "default-avatar-url";
    };

    // Format the retrieved chats
    const formattedChats = chats.map((chat) => {
      const lastMessage = chat.MessagesInChats[0];
      const isGroupChat = chat.ChatType === "group";

      return {
        id: chat.id,
        name: isGroupChat
          ? chat.name
          : getInterlocutorName(chat.UsersInChats, userId),
        avatar: isGroupChat
          ? chat.picpath
          : getInterlocutorAvatar(chat.UsersInChats, userId),
        lastMessage: lastMessage
          ? {
              message: lastMessage.message,
              createdAt: lastMessage.createdAt,
              User: {
                name: lastMessage.User?.name || "Unknown",
                avatar: lastMessage.User?.avatar || "default-avatar-url",
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
        UsersInChats: {
          include: {
            User: true,
          },
        },
        MessagesInChats: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            User: {
              select: {
                name: true,
                avatar: true,
              },
            },
            ImagesInMessages: {
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
      usersInChat: Array<UsersInChats & { User: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.User?.name || "Unknown";
    };

    const getInterlocutorAvatar = (
      usersInChat: Array<UsersInChats & { User: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.User?.avatar || "default-avatar-url";
    };

    const isGroupChat = chat.ChatType === "group";

    const formattedChat = {
      id: chat.id,
      name: isGroupChat
        ? chat.name
        : getInterlocutorName(chat.UsersInChats, userId),
      avatar: isGroupChat
        ? chat.picpath
        : getInterlocutorAvatar(chat.UsersInChats, userId),
      users: chat.UsersInChats.map((u) => ({
        id: u.User.id,
        name: u.User.name,
        avatar: u.User.avatar,
      })),
      messages: chat.MessagesInChats.map((msg) => ({
        id: msg.id,
        message: msg.message,
        createdAt: msg.createdAt,
        User: {
          name: msg.User?.name || "Unknown",
          avatar: msg.User?.avatar || "default-avatar-url",
        },
        images: msg.ImagesInMessages.map((image) => ({
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
        UsersInChats: {
          include: {
            User: true,
          },
        },
      },
    });

    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found.`);
    }

    const getInterlocutorName = (
      usersInChat: Array<UsersInChats & { User: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.User?.name || "Unknown";
    };

    const getInterlocutorAvatar = (
      usersInChat: Array<UsersInChats & { User: User }>,
      currentUserId: number
    ): string => {
      const interlocutor = usersInChat.find((u) => u.userId !== currentUserId);
      return interlocutor?.User?.avatar || "default-avatar-url";
    };

    const isGroupChat = chat.ChatType === "group";

    return {
      id: chat.id,
      name: isGroupChat
        ? chat.name
        : getInterlocutorName(chat.UsersInChats, userId),
      avatar: isGroupChat
        ? chat.picpath
        : getInterlocutorAvatar(chat.UsersInChats, userId),
      users: chat.UsersInChats.map((u) => ({
        id: u.User.id,
        name: u.User.name,
        avatar: u.User.avatar,
      })),
    };
  } catch (error) {
    console.error("Error fetching chat details:", error);
    throw error;
  }
}

// Paginated loading of messages
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
        User: {
          select: {
            name: true,
            avatar: true,
          },
        },
        ImagesInMessages: {
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

export async function createNewChat(
  creatorId: number,
  participantIds: number[],
  chatName?: string,
  isGroupChat: boolean = false,
  avatarBase64?: string | null
) {
  try {
    const allParticipantIds = [creatorId, ...participantIds];

    const filesToUpload: { filename: string; content: Buffer }[] = [];

    let avatarUrl: string = "uploads/chats/default_avatar.jpg";
    let bucketKey: string | null = null;

    if (isGroupChat && avatarBase64) {
      const matches = avatarBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches) {
        throw new Error("Invalid avatar image format.");
      }

      const mimeType = matches[1];
      const imageData = matches[2];
      const buffer = Buffer.from(imageData, "base64");
      const extension = mimeType.split("/")[1];

      const filename = `chats/${Date.now()}.${extension}`;

      filesToUpload.push({
        filename: filename,
        content: buffer,
      });

      const uploadResult = await uploadFiles(filesToUpload);

      if (!uploadResult || uploadResult.length === 0) {
        throw new Error("Failed to upload avatar image.");
      }

      const uploadedAvatar = uploadResult[0];
      avatarUrl = uploadedAvatar.Location;
      bucketKey = uploadedAvatar.Key;
    }

    const newChat = await prisma.chats.create({
      data: {
        name: isGroupChat ? chatName || "Unnamed Group" : "Unnamed",
        ChatType: isGroupChat ? "group" : "private",
        picpath: avatarUrl,
        UsersInChats: {
          create: allParticipantIds.map((userId) => ({ userId })),
        },
      },
      include: {
        UsersInChats: {
          include: {
            User: true,
          },
        },
      },
    });

    return newChat;
  } catch (error) {
    console.error("Error creating new chat:", error);
    throw error;
  }
}