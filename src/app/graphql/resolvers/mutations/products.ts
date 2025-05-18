import { GraphQLContext } from "@/app/lib/context";
import { GraphQLError } from "graphql";

export const productMutation = {
    Mutation: {
        createProduct: async (_: unknown, args: { data: {name: string; variants: { size: "pt" | "rg" | "gr"; price: number }[];categoryId: number;}},context: GraphQLContext) => {
            const { name, variants, categoryId } = args.data;

            const productData = {
                name,
                variants: {
                createMany: {
                    data: variants,
                    skipDuplicates: true,
                },
                },
                categoryId: categoryId,
            };

            const includeData = {
                variants: true,
                category: true,
            };

            try {
                return await context.prisma.product.create({
                data: productData,
                include: includeData,
                });
            } catch (error: unknown) {
                if (error instanceof Error) {

                    if (error.message.includes("database")) {
                        try {
                        await context.prisma.$connect();
                        return await context.prisma.product.create({
                            data: productData,
                            include: includeData,
                        });
                        
                        } catch (reconnectError: unknown) {
                        if (reconnectError instanceof Error) {
                            console.error(`${reconnectError.message}`);

                            throw new GraphQLError("Failed to connect database. Make sure you have your inter and database are running.", {
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
                    //expect error from input / code logic
                    throw new GraphQLError("Something went wrong. Please contact your administrator.", {
                        extensions: {
                        code: "INTERNAL_SERVER_ERROR"
                        }
                    });

                }
                throw new GraphQLError("An unknown error occured while creating an product. Please contact your administrator.", {
                    extensions: {
                        code: "UNKNOWN_CREATE_PRODUCT_ERROR"
                    }
                });
            };
        },

        deleteProduct: async (_: unknown,{ id }: { id: number },context: GraphQLContext) => {
            try {
                const product = await context.prisma.product.findUnique({
                where: { id },
                });

                if (!product) {
                throw new Error("Product not found");
                }

                return await context.prisma.product.delete({ where: { id } });
            } catch (error: unknown) {
                if (error instanceof Error) {

                    if (error.message.includes("database")) {
                        try {
                            await context.prisma.$connect();
                            return await context.prisma.product.delete({ where: { id } });
                        
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
                    //expect error from input / code logic
                    throw new GraphQLError("Something went wrong. Please contact your administrator.", {
                        extensions: {
                        code: "INTERNAL_SERVER_ERROR"
                        }
                    });

                }
                throw new GraphQLError("An unknown error occured while deleting an product. Please contact your administrator.", {
                    extensions: {
                        code: "UNKNOWN_DELETE_PRODUCT_ERROR"
                    }
                });
            };
        },

        updateProduct: async (
            _: unknown,
            args: {
                id: number;
                edits: {
                name: string;
                variants: { size: "pt" | "rg" | "gr"; price: number }[];
                };
            },
            context: GraphQLContext
        ) => {
            const fetchUpdatedProduct = () => {
                return context.prisma.product.findUnique({
                where: { id: args.id },
                include: { variants: { select: { size: true, price: true } } },
                });
            };

            const UpdateLogic = async () => {
                const product = await fetchUpdatedProduct();

                if (args.edits.name && args.edits.name !== product?.name) {
                    const nameExists = await context.prisma.product.findFirst({
                        where: {
                        name: args.edits.name,
                        NOT: { id: args.id },
                        },
                    });

                    if (nameExists) {
                        throw new GraphQLError(`Product name '${args.edits.name}' is already in use.`);
                    }

                    await context.prisma.product.update({
                        where: { id: args.id },
                        data: {
                        name: args.edits.name,
                        },
                    });
                }

                if (args.edits.variants) {
                    await Promise.all(
                        args.edits.variants.map((variant) =>
                            context.prisma.productVariant.updateMany({
                                where: {
                                productId: args.id,
                                size: variant.size,
                                },
                                data: { price: variant.price },
                            })
                        )
                    );
                }
                return fetchUpdatedProduct();
            };

            try {
                return await UpdateLogic();
                
            } catch (error: unknown) {
                if (error instanceof Error) {

                    if (error.message.includes("database")) {
                        try {
                            await context.prisma.$connect();
                            return await UpdateLogic();
                        
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
                    //expect error from input / code logic
                    throw new GraphQLError("Something went wrong. Please contact your administrator.", {
                        extensions: {
                        code: "INTERNAL_SERVER_ERROR"
                        }
                    });

                }
                throw new GraphQLError("An unknown error occured while updating product. Something went wrong. Please contact your administrator.", {
                    extensions: {
                        code: "UNKNOWN_UPDATE_STATUS_ERROR"
                    }
                });
            };
        },



    }
}