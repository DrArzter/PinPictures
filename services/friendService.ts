import { Server } from "socket.io";
import { prisma } from "../src/utils/prisma";
import { Friendships, User, Status } from "@prisma/client"; // Импортируем Status

export async function getFriends(userId: number) {
  try {
    const friends = await prisma.friendships.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        AND: {
          status: Status.confirmed,
        },
      },
      include: {
        user1: true,
        user2: true,
      },
    });
    return friends;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
}

export async function addFriend(userId: number, friendId: number, io: Server) {
  try {
    const friendRequest = await prisma.friendships.create({
      data: {
        user1: { connect: { id: userId } },
        user2: { connect: { id: friendId } },
        status: Status.pending,
      },
    });

    // Отправка уведомления пользователю, которому отправлен запрос
    io.to(`user_${friendId}`).emit("notification", {
      status: "info",
      message: "You have a new friend request!",
      time: 5000,
      clickable: true,
      link_to: "/friends",
    });

    return friendRequest;
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
}

export async function acceptFriendRequest(
  userId: number,
  friendId: number,
  io: Server
) {
  try {
    const friendRequest = await prisma.friendships.update({
      where: {
        user1Id_user2Id: {
          user1Id: userId,
          user2Id: friendId,
        },
      },
      data: {
        status: Status.confirmed,
      },
    });

    io.to(`user_${friendId}`).emit("notification", {
      status: "success",
      message: "Friend request accepted!",
      time: 5000,
      clickable: false,
    });

    io.to(`user_${userId}`).emit("notification", {
      status: "success",
      message: "You are now friends!",
      time: 5000,
      clickable: false,
    });

    return friendRequest;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
}

export async function removeFriend(userId: number, friendId: number) {
  try {
    const friendRequest = await prisma.friendships.delete({
      where: {
        user1Id_user2Id: {
          user1Id: userId,
          user2Id: friendId,
        },
      },
    });
    return friendRequest;
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
}
