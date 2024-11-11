// ./services/chatService.ts
import { prisma } from "@/utils/prisma";

export const getChatsForUser = async (userId: number) => {
    return await prisma.chats.findMany({
        where: {
            users: {
                some: {
                    id: userId,
                },
            },
        },
        include: {
            users: true,
            messages: true,
        },
    });
};