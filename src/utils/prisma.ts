import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  // Добавляем типизацию для глобальной переменной
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Проверяем, если в глобальном объекте нет экземпляра Prisma, создаем его
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };
