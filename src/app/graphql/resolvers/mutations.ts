import { GraphQLContext } from "@/app/lib/context";

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
          age: number;
          email: string;
          password: string;
          role: "CASHIER" | "MANAGER" | "ADMIN";
        };
      },
      context: GraphQLContext
    ) => {
      const { firstname, middlename, lastname, age, email, password, role } =
        args.data;
      const userData = {
        firstname,
        middlename,
        lastname,
        age,
        email,
        password,
        role,
      };

      try {
        return await context.prisma.user.create({ data: userData });
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message.includes("database")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.user.create({ data: userData });
            } catch (reconnectError: unknown) {
              if (reconnectError instanceof Error) {
                throw new Error(
                  `Failed to connect database: ${reconnectError.message}`
                );
              }
              throw new Error("Database is unreachable");
            }
          }
          throw new Error(`Failed to create user: ${error.message}`);
        }
        throw new Error("An unkown error occured while creating user.");
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
          if (error.message.includes("database")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.category.delete({ where: { name } });
            } catch (reconnectError: unknown) {
              if (reconnectError instanceof Error) {
                throw new Error(
                  `Failed to connect database: ${reconnectError.message}`
                );
              }
              throw new Error("Database is unreachable.");
            }
          }
          throw new Error(`Failed to delete category: ${error.message}`);
        }
        throw new Error("An unknown error occured while deleting category.");
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
          variants: { size: "PT" | "RG" | "GR"; price: number }[];
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
              return await context.prisma.product.create({ data: productData });
            } catch (reconnectError: unknown) {
              if (reconnectError instanceof Error) {
                throw new Error(
                  `Failed to connect database: ${reconnectError.message}`
                );
              }
              throw new Error("Database is unreachable.");
            }
          }
          throw new Error(`Failed to create product: ${error.message}`);
        }
        throw new Error("An unknown error occured while creating product.");
      }
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
                throw new Error(
                  `Failed to connect database: ${reconnectError.message}`
                );
              }
              throw new Error("Database is unreachable.");
            }
          }
          throw new Error(`Failed to create product: ${error.message}`);
        }
        throw new Error("An unknown error occured while creating product.");
      }
    },

    updateProduct: async (
      _: unknown,
      args: {
        id: number;
        edits: {
          name: string;
          variants: { size: "PT" | "RG" | "GR"; price: number }[];
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
            throw new Error(
              `Product name '${args.edits.name}' is already in use.`
            );
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
                throw new Error(
                  `Failed to connect database: ${reconnectError.message}`
                );
              }
              throw new Error("Database is unreachable.");
            }
          }
          throw new Error(`Failed to update product: ${error.message}`);
        }
        throw new Error("An unknown error occured while updating product.");
      }
    },

    createOrder: async (
      _: unknown,
      args: {
        data: {
          items: {
            productVariantId: number;
            quantity: number;
            subtotal: number;
          }[];
          total: number;
          status: "QUEUE" | "COMPLETED" | "VOIDED";
          userId: string;
        };
      },
      context: GraphQLContext
    ) => {
      const { items, total, status, userId } = args.data;
      try {
        return await context.prisma.order.create({
          data: {
            items: {
              create: items.map((item) => ({
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                subtotal: item.subtotal,
              })),
            },
            total,
            status,
            userId,
          },
          include: {
            items: {
              include: {
                productVariant: true,
              },
            },
          },
        });
      } catch (error) {
        console.error(error); //simple error for nowwwwwwwww
      }
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
                throw new Error(
                  `Failed to connect database: ${reconnectError.message}`
                );
              }
              throw new Error("Database is unreachable.");
            }
          }
          throw new Error(`Failed to void an order: ${error.message}`);
        }
        throw new Error("An unknown error occured while voiding an order.");
      }
    },

    updateOrderStatus: async (
      _: unknown,
      args: { data: { id: number; status: "QUEUE" | "COMPLETED" | "VOIDED" } },
      context: GraphQLContext
    ) => {
      try {
        return await context.prisma.order.update({
          where: {
            id: args.data.id,
          },
          data: {
            status: args.data.status,
          },
        });
      } catch (error) {
        console.error(error); //simple error for now
      }
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
