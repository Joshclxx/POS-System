import { PrismaClient } from "@prisma/client";

// Type-safe global object to store prisma instance across multiple invoctaions
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use existing global prisma instance if it's defined, else create a new one
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
});

// In development, attach the prisma instance to the global object to avoid multiple clients
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;