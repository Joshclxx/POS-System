import { GraphQLContext } from "../../lib/context";

export const query = {
  Query: {
    //USERS----------------------------------------------------------------------------------------------
    //ALL USERS
    getAllUsers: async (_: unknown, __: unknown, context : GraphQLContext) => {  
      try {
        return await context.prisma.user.findMany();

      } catch (error: unknown) {
        if (error instanceof Error) {

          if(error.message.includes("connect")){
            try {
              await context.prisma.$connect();
              return await context.prisma.user.findMany();

            } catch (reconnectError: unknown) {
              if(reconnectError instanceof Error) {
                throw new Error(`Failed to connect database: ${reconnectError.message}`)
              }
              throw new Error(`Database is unreachable.`);
            }
          }
          throw new Error(`Failed to fetch users: ${error.message}`);
          
        }
        throw new Error("An unknown error occurred while fetching users.");
      }
    },

    //1 USER
    getUser: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {  
      try {
        return await context.prisma.user.findUnique({where: { id }});

      } catch (error: unknown) {
        if (error instanceof Error) {

          if(error.message.includes("connect")){
            try {
              await context.prisma.$connect();
              return await context.prisma.user.findUnique({where: {id}})

            } catch (reconnectError: unknown) {
              if(reconnectError instanceof Error) {
                throw new Error(`Failed to connect database.`);
              }
              throw new Error("Database is unreachable");
            }
          }
          throw new Error(`Failed to fetch user: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching the user.");
      }
    },

    //PRODUCTS-------------------------------------------------------------------------------------------
    //ALL PRODUCTS
    getAllProducts: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const includeData = {
        variants: {
          select: {
            size: true,
            price: true
          }
        },
        category: {
          select: {
            name: true,
          }
        }
      }

      try {
        return await context.prisma.product.findMany({include: includeData})

      } catch (error: unknown) {
        if (error instanceof Error){

          if (error.message.includes("connect")){
            try {
              await context.prisma.$connect();
              return await context.prisma.product.findMany({include: includeData})

            } catch (reconnectError: unknown) {
              if(reconnectError instanceof Error) {
                throw new Error(`Failed to connect database: ${reconnectError.message}`);
              }
              throw new Error("Database is unreachable");
            }
          }
          throw new Error(`Failed to fetch products: ${error.message}`);

        }
        throw new Error("An unknown error occured while fetching products.");
      }
    },

    //1 PRODUCT
    getProduct: async (_: unknown, {name} : {name: string}, context: GraphQLContext) => {
      const includeData = {
        variants: {
          select: {
            size: true,
            price: true
          }
        },
        category: {
          select: {
            name: true,
          }
        }
      }

      try {
        return await context.prisma.product.findUnique({where: {name}, include: includeData});

      } catch (error: unknown) {
        if (error instanceof Error) {

          if (error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.product.findUnique({where: {name}, include: includeData});

            } catch (reconnectError: unknown) {
              if (reconnectError instanceof Error) {
                throw new Error(`Failed to connect database: ${reconnectError.message}`);
              }
              throw new Error("Database is unreachable.")
            }
          }
          throw new Error(`Failed to fetch product: ${error.message}`)

        }
        throw new Error("An unknown error occured while fetching the product.");
      }
    },

    //ORDERS---------------------------------------------------------------------------------------------
    //ALL ORDERS
    getAllOrders: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const includeData = {
        items: {
          select: {
            productVariant: {
              select: {
                size: true,
                price: true,
                product: {
                  select: {
                    name: true
                  }
                }
              }
            },
            quantity: true,
            subtotal: true,
          }
        }
      }

      try {
        return await context.prisma.order.findMany({include: includeData});

      } catch (error: unknown) {
        if(error instanceof Error) {

          if(error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.order.findMany({include: includeData});

            } catch (reconnectError) {
              throw new Error(`Database is unreachable: ${reconnectError}`);
            }
          }
          throw new Error(`Failed to fetch orders: ${error.message}`);

        }
        throw new Error("An unkown error occured while fetching orders.")
      }
    },

    //1 ORDER
    getOrder: async (_: unknown, {id} : {id : number}, context: GraphQLContext) => {
      const includeData = {
        items: {
          select: {
            productVariant: {
              select: {
                size: true,
                price: true,
                product: {
                  select: {
                    name: true
                  }
                }
              }
            },
            quantity: true,
            subtotal: true,
          }
        }
      }

      try {
        return await context.prisma.order.findUnique({where: {id}, include: includeData});
      } catch (error: unknown) {
        if(error instanceof Error) {

          if(error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.order.findUnique({where: {id}, include: includeData});
              
            } catch (reconnectError: unknown) {
              if(reconnectError instanceof Error) {
                throw new Error(`Failed to connect database: ${reconnectError.message}`);
              }
              throw new Error("Database is unreachable.")
            }
          }

          throw new Error(`Failed to fetch orders: ${error.message}`);
        }
      }
    },

  },
};
