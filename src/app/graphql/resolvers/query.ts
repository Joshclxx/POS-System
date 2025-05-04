import { GraphQLContext } from "../../lib/context";

export const query = {
  Query: {
    //USERS----------------------------------------------------------------------------------------------
    //all users
    users: async (_: unknown, __: unknown, context : GraphQLContext) => {  
      try {
        return await context.prisma.user.findMany();
      } catch (error: unknown) {
        if (error instanceof Error) {
            if(error.message.includes("connection")){
              await context.prisma.$connect();
              return await context.prisma.user.findMany()
            }
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching users.");
      }
    },

    //1 user
    user: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {  
      try {
        return await context.prisma.user.findUnique({
          where: { id },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
            if(error.message.includes("connection")){
                await context.prisma.$connect();
                return await context.prisma.user.findMany()
            }
          throw new Error(`Failed to fetch user: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching the user.");
      }
    },
  },

};
