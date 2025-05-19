import { GraphQLContext } from "@/app/lib/context";
import { GraphQLError } from "graphql";

export const categoryMutations = {
    Mutation: {
        createCategory: async (_: unknown, args: { data: { name: string } }, context: GraphQLContext) => {
            try {
                return await context.prisma.category.create({data: { name: args.data.name }});
            } catch (error: unknown) {
                if (error instanceof Error) {

                    if (error.message.includes("connect")) {
                        try {
                        await context.prisma.$connect();
                        return await context.prisma.category.create({data: { name: args.data.name }});
                        
                        } catch (reconnectError: unknown) {
                        if (reconnectError instanceof Error) {
                            console.error(`${reconnectError.message}`);

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
                throw new GraphQLError("An unknown error occured while creating an user.", {
                extensions: {
                    code: "UNKNOWN_CREATE_CATEGORY_ERROR"
                }
                });
            }
        },
        
        deleteCategory: async (_: unknown,{ name }: { name: string },context: GraphQLContext) => {
            try {
                return await context.prisma.category.delete({ where: { name } });
            } catch (error: unknown) {
                if (error instanceof Error) {

                    if (error.message.includes("connect")) {
                        try {
                            await context.prisma.$connect();
                            return await context.prisma.category.delete({ where: { name } });
                            
                        } catch (reconnectError: unknown) {
                            if (reconnectError instanceof Error) {
                                console.error(`${reconnectError.message}`);
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
                throw new GraphQLError("An unknown error occured while creating an user.", {
                    extensions: {
                        code: "UNKNOWN_DELETE_CATEGORY_ERROR"
                    }
                });
            }
        },

        updateCategory: async (_: unknown, args: {id: number, name:  string}, context: GraphQLContext) => {
            try {
                return await context.prisma.category.update({where: {id: args.id}, data: {name: args.name}})
            } catch (error: unknown) {
                if (error instanceof Error) {

                    if (error.message.includes("connect")) {
                        try {
                            await context.prisma.$connect();
                            return await context.prisma.category.update({where: {id: args.id}, data: {name: args.name}})
                            
                        } catch (reconnectError: unknown) {
                            if (reconnectError instanceof Error) {
                                console.error(`${reconnectError.message}`);
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
                throw new GraphQLError("An unknown error occured while creating an user.", {
                    extensions: {
                        code: "UNKNOWN_UPDATE_CATEGORY_ERROR"
                    }
                });
            }
        },


    }
}