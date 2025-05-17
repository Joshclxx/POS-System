import { GraphQLContext } from "@/app/lib/context";
import { GraphQLError } from "graphql";


export const mutationResolvers = {
  Mutation: {


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
