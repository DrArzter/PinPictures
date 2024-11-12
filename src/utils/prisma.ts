// ./src/utils/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const globalAny: any = global;

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globalAny.prisma) {
    globalAny.prisma = new PrismaClient();
  }
  prisma = globalAny.prisma;
}

export { prisma };
