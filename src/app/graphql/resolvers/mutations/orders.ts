import { GraphQLContext } from "@/app/lib/context";
import { GraphQLError } from "graphql"; 

export const ordersMutation = {
    Mutation: {
        createOrder: async (
            _: unknown,
            args: {
                data: {
                items: {
                    productName: string;
                    productSize: "pt" | "rg" | "gr";
                    productPrice: number;
                    quantity: number;
                    subtotal: number;
                }[];
                total: number;
                userId: string;
                };
            },
            context: GraphQLContext
        ) => {
            const { items, total, userId } = args.data;
            const orderData = {
                items: {
                    create: items.map((item) => ({
                        productName: item.productName.toLowerCase(),
                        productSize: item.productSize,
                        productPrice: item.productPrice,
                        quantity: item.quantity,
                        subtotal: item.subtotal,
                    })),
                },
                total,
                userId,
            };
            
            try {
                return await context.prisma.order.create({data: orderData, include: {items: true}});
            } catch (error: unknown) {
                if (error instanceof Error) {

                    if (error.message.includes("database")) {
                        try {
                            await context.prisma.$connect();
                            return await context.prisma.order.create({data: orderData, include: {items: true}});
                        
                        } catch (reconnectError: unknown) {
                            if (reconnectError instanceof Error) {
                                throw new GraphQLError("Failed to connect database. Make sure your database is running.", {
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
                throw new GraphQLError("An unknown error occured while creating an order. Please contact your administrator.", {
                    extensions: {
                        code: "UNKNOWN_CREATE_ORDER_ERROR"
                    }
                });
            };
        },

        createVoidOrder: async (_: unknown, args: {data: {orderId: number, shiftId: number, userId: string}}, context: GraphQLContext) => {
            const voidOrderData = {
                orderId: args.data.orderId,
                shiftId: args.data.shiftId,
                userId: args.data.userId
            }

            try {
                return await context.prisma.voidedOrder.create({data: voidOrderData})

            } catch (error: unknown) {
                if (error instanceof Error) {

                    if (error.message.includes("database")) {
                        try {
                            await context.prisma.$connect();
                            return await context.prisma.voidedOrder.create({data: voidOrderData})
                        
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
                    //expect error from input / code logi
                    throw new GraphQLError("Something went wrong. Please contact your administrator.", {
                        extensions: {
                        code: "INTERNAL_SERVER_ERROR"
                        }
                    });
                }
                throw new GraphQLError("An unknown error occured while voiding an order. Please contact your administrator.", {
                    extensions: {
                        code: "UNKNOWN_VOID_ERROR"
                    }
                });
            };
        },

        updateOrderStatus: async (
            _: unknown,
            args: { data: { id: number; status: "queue" | "completed" | "voided" } },
            context: GraphQLContext
            ) => {
            try {
                return await context.prisma.order.update({where: {id: args.data.id,}, data: {status: args.data.status,}});
            } catch (error: unknown) {
                if (error instanceof Error) {

                    if (error.message.includes("database")) {
                        try {
                            await context.prisma.$connect();
                            return await context.prisma.order.update({where: {id: args.data.id,}, data: {status: args.data.status,}});
                        
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
                    //expect error from input / code logi
                    throw new GraphQLError("Failed to update order status. Please contact your administrator.", {
                        extensions: {
                        code: "INTERNAL_SERVER_ERROR"
                        }
                    });

                }
                throw new GraphQLError("An unknown error occured while updating order status. Please contact your administrator.", {
                    extensions: {
                        code: "UNKNOWN_UPDATE_STATUS_ERROR"
                    }
                });
            };
        },

    }
}