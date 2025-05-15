import { GraphQLContext } from "../../lib/context";
import { format } from 'date-fns';

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

    userLogin: async (_: unknown, args: {data: {email: string, password: string}}, context: GraphQLContext) => {
      const { email, password } = args.data;

      const fetchUser = () => {
        return context.prisma.user.findUnique({
          where: {
            email_password: {
              email: email.toLowerCase(),
              password: password
            }
          }
        })
      };

      const userDataFormat = async () => {
        const user = await fetchUser();

        if(!user) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email, // I will include email and password for testing purposes  
          password: user.password, // I didn't use hashed password for now for testing purposes
          role: user.role
        }
      };

      try {
        return userDataFormat();

      } catch (error: unknown) {
        if (error instanceof Error) {

          if(error.message.includes("connect")){
            try {
              await context.prisma.$connect();
              return userDataFormat();

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
      // const includeData = {
      //   variants: {
      //     select: {
      //       size: true,
      //       price: true
      //     }
      //   },
      //   category: {
      //     select: {
      //       name: true,
      //     }
      //   }
      // }

      try {
        return await context.prisma.product.findUnique({where: {name}});

      } catch (error: unknown) {
        if (error instanceof Error) {

          if (error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.product.findUnique({where: {name}});

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

    getAllCategories: async (_: unknown, __: unknown, context: GraphQLContext) => {
      try {
        return await context.prisma.category.findMany();

      } catch (error: unknown) {
        if(error instanceof Error) {
          
          if(error.message.includes("database")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.category.findMany();

            } catch (reconnectError: unknown) {
              if(reconnectError instanceof Error) {
                throw new Error(`Failed to connect database: ${reconnectError.message}`);
              }
              throw new Error("Database is unreachable");
            }
          }
          throw new Error(`Failed to fetch categories: ${error.message}`);

        }
        throw new Error("An unknown error occured while fetching the categories.");
      }
    },
    

    getCategory: async (_: unknown, {name} : {name: string}, context: GraphQLContext) => {
      try {
        return await context.prisma.category.findUnique({where: {name}})

      } catch (error: unknown) {
        if(error instanceof Error) {
          
          if(error.message.includes("database")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.category.findUnique({where: {name}})

            } catch (reconnectError: unknown) {
              if(reconnectError instanceof Error) {
                throw new Error(`Failed to connect database: ${reconnectError.message}`);
              }
              throw new Error("Database is unreachable");
            }
          }
          throw new Error(`Failed to fetch category: ${error.message}`);

        }
        throw new Error("An unknown error occured while fetching the category.");
      }
    },

    getProductVariant: async (_: unknown, args : {data: {productId: number, size: "pt" | "rg" | "gr"}}, context: GraphQLContext) => {
      try {
        return await context.prisma.productVariant.findUnique({
          where: {
            productId_size: {
              productId: args.data.productId,
              size: args.data.size
            }
          }
        });
        
      } catch (error: unknown) {
        if(error instanceof Error) {

          if(error.message.includes("database")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.productVariant.findUnique({
                where: {
                  productId_size: {
                    productId: args.data.productId,
                    size: args.data.size
                  }
                }
              });

            } catch(reconnectError: unknown) {
              if(reconnectError instanceof Error) {
                throw new Error(`Failed to connect database: ${reconnectError.message}`);
              }
              throw new Error("Database is unreachable.");
            }
          }
          throw new Error(`Failed to get product variants.`);

        }
        throw new Error("An unknown error occured while fetching product variants.");
      }
    },
    
    //ORDERS---------------------------------------------------------------------------------------------
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
          createdAt: order.createdAt ? format(order.createdAt, "MM/dd/yyyy hh:mm:dd a") : null
        }));

        return formattedOrders;

      } catch (error: unknown) {
        if(error instanceof Error) {

          if(error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              const orders = await context.prisma.order.findMany({include: includeData});
              const formattedOrders = orders.map(order => ({
                ...order,
                createdAt: order.createdAt ? format(order.createdAt, "MM/dd/yyyy hh:mm:dd a") : null
              }));

              return formattedOrders;

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
