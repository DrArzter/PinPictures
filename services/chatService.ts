// ./services/chatService.ts
import { prisma } from "../src/utils/prisma";
import { UsersInChats, User } from "@prisma/client";

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
            createdAt: "asc", // Изменено на "asc" для упорядочивания сообщений по времени
          },
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
      })),
    };

    return formattedChat;
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    throw error;
  }
}
