import { GraphQLError } from "graphql";
import { GraphQLContext } from "@/app/lib/context";


export const loginMutation = {
    Mutation: {
        recordLogin: async (_: unknown, {userId} : {userId: string}, context: GraphQLContext) => {
            const loginData = {
                userId,
                timeIn: new Date(),
            }

            try {
                return await context.prisma.loginHistory.create({data: loginData});
            } catch (error) {
                console.error(error) // simple error for now
            }
        },

        // updateLoginRecord: async (_: unknown, {id} : {id: string}, context: GraphQLContext) => {

        // }
    }
}