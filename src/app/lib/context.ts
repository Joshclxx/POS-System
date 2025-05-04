import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma"; 

// Define the context type with prisma as one of the fields
export type GraphQLContext = {
  prisma: PrismaClient;
};

export const context: GraphQLContext = {
  prisma,  // This makes the Prisma client available throughout all resolvers
};