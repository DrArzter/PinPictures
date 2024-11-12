// ./services/chatService.ts
import { prisma } from '../src/utils/prisma';
import { UsersInChats, User } from '@prisma/client';

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
            createdAt: 'desc',
          },
          take: 1,
          include: {
            author: true,
          },
        },
      },
    });

    // Process chats to format the response as per your requirements
    const formattedChats = chats.map(chat => {
      const lastMessage = chat.messages[0];
      const isGroupChat = chat.ChatType === 'group';

      return {
        chatId: chat.id,
        name: isGroupChat ? chat.name : getInterlocutorName(chat.users, userId),
        avatar: isGroupChat ? chat.picpath : getInterlocutorAvatar(chat.users, userId),
        lastMessage: lastMessage ? lastMessage.message : null,
        lastMessageTime: lastMessage ? lastMessage.createdAt : null,
      };
    });

    return formattedChats;
  } catch (error) {
    console.error('Error fetching chats for user:', error);
    throw error;
  }
}

function getInterlocutorName(usersInChat: Array<UsersInChats & { user: User }>, currentUserId: number) {
  const interlocutor = usersInChat.find(u => u.userId !== currentUserId);
  return interlocutor ? interlocutor.user.name : 'Unknown';
}

function getInterlocutorAvatar(usersInChat: Array<UsersInChats & { user: User }>, currentUserId: number) {
  const interlocutor = usersInChat.find(u => u.userId !== currentUserId);
  return interlocutor ? interlocutor.user.avatar : 'default_avatar.jpg';
}
