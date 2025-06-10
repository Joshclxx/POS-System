import { GraphQLContext } from "../../../lib/context";
import { format } from 'date-fns';
import { GraphQLError } from "graphql";

export const ordersQuery = {
  Query: {
    //ALL ORDERS
    getAllOrders: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const includeData = {
        items: {
          select: {
            productName: true,
            productSize: true,
            productPrice: true,
            quantity: true,
            subtotal: true,
          }
        }
      }

      try {
        const orders = await context.prisma.order.findMany({include: includeData});
        const formattedOrders = orders.map(order => ({
          ...order,
          createdAt: order.createdAt ? format(order.createdAt, "MM/dd/yyyy hh:mm:ss a") : null
        }));

        return formattedOrders;

      } catch (error: unknown) {
        if (error instanceof Error) {

          if (error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              const orders = await context.prisma.order.findMany({include: includeData});
              const formattedOrders = orders.map(order => ({
                ...order,
               createdAt: order.createdAt ? format(order.createdAt, "MM/dd/yyyy hh:mm:ss a") : null
              }));

              return formattedOrders;
            
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
        throw new GraphQLError("An unknown error occured while fetching all orders.", {
          extensions: {
            code: "UNKNOWN_GET_ALL_ORDERS_ERROR"
          }
        });
      }
    },

    //1 ORDER
    getOrder: async (_: unknown, {id} : {id : number}, context: GraphQLContext) => {
      const includeData = {
        items: {
          select: {
            productName: true,
            productSize: true,
            productPrice: true,
            quantity: true,
            subtotal: true,
          }
        }
      }

      try {
        return await context.prisma.order.findUnique({where: {id}, include: includeData});
      } catch (error: unknown) {
        if (error instanceof Error) {

          if (error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.order.findUnique({where: {id}, include: includeData}); 
            
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
        throw new GraphQLError("An unknown error occured while fetching an order.", {
          extensions: {
            code: "UNKNOWN_GET_ORDER_ERROR"
          }
        });
      }
    },

  },
};
