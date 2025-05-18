import { GraphQLContext } from "../../../lib/context";
import { GraphQLError } from "graphql";

export const productsQuery = {
  Query: {
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
        if (error instanceof Error) {

          if (error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.product.findMany({include: includeData})
            
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
        throw new GraphQLError("An unknown error occured while fetching all products.", {
          extensions: {
            code: "UNKNOWN_GET_CATEGORY_ERROR"
          }
        });
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
        throw new GraphQLError("An unknown error occured while fetching product.", {
          extensions: {
            code: "UNKNOWN_GET_PRODUCT_ERROR"
          }
        });
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
        if (error instanceof Error) {

          if (error.message.includes("connect")) {
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
        throw new GraphQLError("An unknown error occured while fetching product variant.", {
          extensions: {
            code: "UNKNOWN_GET_PRODUCT_VARIANT_ERROR"
          }
        });
      }
    },
    

  },
};
