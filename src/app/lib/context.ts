import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma"; 


export type GraphQLContext = {
  prisma: PrismaClient;
};

export const context: GraphQLContext = {
  prisma,  
};