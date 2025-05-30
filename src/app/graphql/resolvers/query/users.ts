import { GraphQLContext } from "@/app/lib/context";
import {format} from "date-fns"
import { GraphQLError } from "graphql";

export const usersQuery = {
    Query: {
        getAllUsers: async (_: unknown, __: unknown, context : GraphQLContext) => {  
            try {
                return await context.prisma.user.findMany();

            } catch (error: unknown) {
                if (error instanceof Error) {

                    if (error.message.includes("connect")) {
                        try {
                            await context.prisma.$connect();
                            return await context.prisma.user.findMany();
                        
                        } catch (reconnectError: unknown) {
                        if (reconnectError instanceof Error) {
                            throw new GraphQLError("Failed to connect database. Make sure your database are running.", {
                                extensions: {
                                    code: "FAILED_RECONNECTION_DB"  
                                },
                            });
                        }

                        throw new GraphQLError("Database is unreachable. Make sure your database are running.", {
                            extensions: {
                               code: "NO_DATABASE_FOUND"
                            },
                        });
                        }
                    }
                    throw new GraphQLError("Something went wrong. Please contact your administrator.", {
                        extensions: {
                           code: "INTERNAL_SERVER_ERROR"
                        }
                    });

                }
                throw new GraphQLError("An unknown error occured fetching all users.", {
                    extensions: {
                        code: "UNKNOWN_GET_ALL_USER_ERROR"
                    }
                });
            }
        },
    
        //1 USER
        getUser: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {  
            try {
                return await context.prisma.user.findUnique({where: { id }});

            } catch (error: unknown) {
                if (error instanceof Error) {

                    if (error.message.includes("connect")) {
                        try {
                            await context.prisma.$connect();
                            return await context.prisma.user.findUnique({where: { id }});
                        
                        } catch (reconnectError: unknown) {
                        if (reconnectError instanceof Error) {
                            throw new GraphQLError("Failed to connect database. Make sure your database are running.", {
                                extensions: {
                                    code: "FAILED_RECONNECTION_DB"  
                                },
                            });
                        }

                        throw new GraphQLError("Database is unreachable. Make sure your database are running.", {
                            extensions: {
                               code: "NO_DATABASE_FOUND"
                            },
                        });
                        }
                    }
                    throw new GraphQLError("Something went wrong. Please contact your administrator.", {
                        extensions: {
                           code: "INTERNAL_SERVER_ERROR"
                        }
                    });

                }
                throw new GraphQLError("An unknown error occured fetching an user.", {
                    extensions: {
                        code: "UNKNOWN_GET_USER_ERROR"
                    }
                });
            }
        },

        getSpotCheckHistory: async (_: unknown, __: unknown, context: GraphQLContext) => {
            try {
                const spotCheckHistory = await context.prisma.spotcheck.findMany({
                    include: { user: true },
                });

                return spotCheckHistory.map((item) => ({
                    ...item,
                    createdAt: item.createdAt ? format(item.createdAt, "MM/dd/yyyy hh:mm:ss a") : null,
                }));

            } catch (error) {
                console.error(error) // simple error fow now
            }
        },

        getAllUserShift: async (_: unknown, __: unknown, context: GraphQLContext) => {
            try {
                return await context.prisma.shift.findMany();
            } catch (error) {
                console.error(error) //simple error for now
            }
        }

    }
}