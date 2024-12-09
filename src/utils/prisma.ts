import { PrismaClient } from "@prisma/client";

// Декларируем глобальный объект для TypeScript
declare global {
  let prisma: PrismaClient | undefined;
}

const globalNode: typeof globalThis & { prisma?: PrismaClient } = globalThis;

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globalNode.prisma) {
    globalNode.prisma = new PrismaClient();
  }
  prisma = globalNode.prisma;
}

export { prisma };
