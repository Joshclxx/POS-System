import { GraphQLContext } from "@/app/lib/context";
import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";


export const mutationResolvers = {
  Mutation: {
    //CREATE MUTATION----------------------------------------------------------------------------------------------------------------------------------
    createUser: async (
      _: unknown,
      args: {
        data: {
          firstname: string;
          middlename: string;
          lastname: string;
          suffix: string;
          gender: "male" | "female";
          email: string;
          password: string;
          role: "cashier" | "manager" | "admin";
        };
      },
      context: GraphQLContext
    ) => {
      const { firstname, middlename, lastname, suffix, gender, email, password, role } =
        args.data;
      const userData = {
        firstname: firstname.toLowerCase(),
        middlename: middlename.toLowerCase(),
        lastname: lastname.toLowerCase(),
        suffix: suffix ? suffix.toLowerCase() : "N/A",
        gender,
        email: email.toLowerCase(),
        password,
        role,
      };

      try {
        return await context.prisma.user.create({ data: userData });
      } catch (error: unknown) {
        if (error instanceof Error) {

          if (error instanceof Prisma.PrismaClientInitializationError || error.message.includes("ECONNREFUSED ") || error.message.includes("ENOTFOUND")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.user.create({ data: userData });
              
            } catch (reconnectError: unknown) {
              if (reconnectError instanceof Error) {
                console.error(`${reconnectError.message}`);

                throw new GraphQLError("Failed to connect database. Make sure you have your inter and database are running.", {
                  extensions: {
                    code: "FAILED_RECONNECTION_DB"  
                  },
                });
              }

              throw new GraphQLError("Database is unreachable.", {
                extensions: {
                  code: "NO_DATABASE_FOUND"
                },
              });
            }
          }
          console.error(error.message)
          throw new GraphQLError("Failed to create user. Make sure you're connected to the Internet."), {
            connection: {
              code: "INTERNAL_SERVER_ERROR"
            }
          };

        }
        throw new GraphQLError("An unknown error occured while creating an user."), {
          extension: {
            code: "UNKNOWN_CREATE_USER_ERROR"
          }
        };
      }
    },

    deleteCategory: async (
      _: unknown,
      { name }: { name: string },
      context: GraphQLContext
    ) => {
      try {
        return await context.prisma.category.delete({ where: { name } });
      } catch (error: unknown) {
        if (error instanceof Error) {

          if (error instanceof Prisma.PrismaClientInitializationError || error.message.includes("ECONNREFUSED ") || error.message.includes("ENOTFOUND")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.category.delete({ where: { name } });
              
            } catch (reconnectError: unknown) {
              if (reconnectError instanceof Error) {
                console.error(`${reconnectError.message}`);

                throw new GraphQLError("Failed to connect database. Make sure you have your inter and database are running.", {
                  extensions: {
                    code: "FAILED_RECONNECTION_DB"  
                  },
                });
              }

              throw new GraphQLError("Database is unreachable.", {
                extensions: {
                  code: "NO_DATABASE_FOUND"
                },
              });
            }
          }
          console.error(error.message)
          throw new GraphQLError("Failed to create user. Make sure you're connected to the Internet.", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR"
            }
          });

        }
        throw new GraphQLError("An unknown error occured while deleting an user.", {
          extensions: {
            code: "UNKNOWN_DELETE_CATEGORY_ERROR"
          }
        });
      }
    },

    createCategory: async (
      _: unknown,
      args: { data: { name: string } },
      context: GraphQLContext
    ) => {
      try {
        return await context.prisma.category.create({
          data: { name: args.data.name },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message.includes("database")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.category.create({
                data: { name: args.data.name },
              });
            } catch (reconnectError: unknown) {
              if (reconnectError instanceof Error) {
                throw new Error(
                  `Failed to connect database: ${reconnectError.message}`
                );
              }
              throw new Error("Database is unreachable.");
            }
          }
          throw new Error(`Failed to create category: ${error.message}`);
        }
        throw new Error("An unknown error occured while creating category.");
      }
    },

    createProduct: async (
      _: unknown,
      args: {
        data: {
          name: string;
          variants: { size: "pt" | "rg" | "gr"; price: number }[];
          categoryId: number;
        };
      },
      context: GraphQLContext
    ) => {
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

              throw new GraphQLError("Database is unreachable.", {
                extensions: {
                  code: "NO_DATABASE_FOUND"
                },
              });
            }
          }
          //expect error from input / code logic
          throw new GraphQLError("Failed to void an order. Make sure you're connected to the Internet.", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR"
            }
          });
        }
        throw new GraphQLError("An unknown error occured while voiding an order.", {
          extensions: {
            code: "UNKNOWN_CREATE_PRODUCT_ERROR"
          }
        });
      };
    },

    deleteProduct: async (
      _: unknown,
      { id }: { id: number },
      context: GraphQLContext
    ) => {
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

                throw new GraphQLError("Failed to connect database. Make sure you have your inter and database are running.", {
                  extensions: {
                    code: "FAILED_RECONNECTION_DB"  
                  },
                });
              }

              throw new GraphQLError("Database is unreachable.", {
                extensions: {
                  code: "NO_DATABASE_FOUND"
                },
              });
            }
          }
          //expect error from input / code logic
          throw new GraphQLError("Failed to void an order. Make sure you're connected to the Internet.", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR"
            }
          });
        }
        throw new GraphQLError("An unknown error occured while voiding an order.", {
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
                console.error(`${reconnectError.message}`);

                throw new GraphQLError("Failed to connect database. Make sure you have your inter and database are running.", {
                  extensions: {
                    code: "FAILED_RECONNECTION_DB"  
                  },
                });
              }

              throw new GraphQLError("Database is unreachable.", {
                extensions: {
                  code: "NO_DATABASE_FOUND"
                },
              });
            }
          }
          //expect error from input / code logic
          throw new GraphQLError("Failed to void an order. Make sure you're connected to the Internet.", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR"
            }
          });
        }
        throw new GraphQLError("An unknown error occured while voiding an order.", {
          extensions: {
            code: "UNKNOWN_UPDATE_STATUS_ERROR"
          }
        });
      };
    },

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
                console.error(`${reconnectError.message}`);

                throw new GraphQLError("Failed to connect database. Make sure your database is running.", {
                  extensions: {
                    code: "FAILED_RECONNECTION_DB"  
                  },
                });
              }
              throw new GraphQLError("Database is unreachable.", {
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
        throw new GraphQLError("An unknown error occured while voiding an order.", {
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
                console.error(`${reconnectError.message}`);

                throw new GraphQLError("Failed to connect database. Make sure you have your inter and database are running.", {
                  extensions: {
                    code: "FAILED_RECONNECTION_DB"  
                  },
                });
              }

              throw new GraphQLError("Database is unreachable.", {
                extensions: {
                  code: "NO_DATABASE_FOUND"
                },
              });
            }
          }
          //expect error from input / code logi
          throw new GraphQLError("Failed to void an order. Make sure you're connected to the Internet.", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR"
            }
          });
        }
        throw new GraphQLError("An unknown error occured while voiding an order.", {
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

                throw new GraphQLError("Failed to connect database. Make sure you have your inter and database are running.", {
                  extensions: {
                    code: "FAILED_RECONNECTION_DB"  
                  },
                });
              }

              throw new GraphQLError("Database is unreachable.", {
                extensions: {
                  code: "NO_DATABASE_FOUND"
                },
              });
            }
          }
          //expect error from input / code logi
          throw new GraphQLError("Failed to void an order. Make sure you're connected to the Internet.", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR"
            }
          });
        }
        throw new GraphQLError("An unknown error occured while voiding an order.", {
          extensions: {
            code: "UNKNOWN_UPDATE_STATUS_ERROR"
          }
        });
      };
    },

    // deleteAllOrder: async (
    //   _: unknown,
    //   __: unknown,
    //   context: GraphQLContext
    // ) => {
    //   try {
    //     return await context.prisma.order.deleteMany();
    //   } catch (error) {
    //     console.error(error); // simple error fow now
    //   }
    // },
  },
};
