import { GraphQLContext } from "../../../lib/context";
import { GraphQLError } from "graphql";

export const categoriesQuery = {
  Query: {
    getAllCategories: async (_: unknown, __: unknown, context: GraphQLContext) => {
      try {
        return await context.prisma.category.findMany();

      } catch (error: unknown) {
        if (error instanceof Error) {

          if (error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.category.findMany();
            
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
        throw new GraphQLError("An unknown error occured while fetching all categories.", {
          extensions: {
            code: "UNKNOWN_GET_ALL_CATEGORIES_ERROR"
          }
        });
      }
    },
    

    getCategory: async (_: unknown, {name} : {name: string}, context: GraphQLContext) => {
      try {
        return await context.prisma.category.findUnique({where: {name}})

      } catch (error: unknown) {
        if (error instanceof Error) {

          if (error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.category.findUnique({where: {name}})
            
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
        throw new GraphQLError("An unknown error occured while fetching category.", {
          extensions: {
            code: "UNKNOWN_GET_CATEGORY_ERROR"
          }
        });
      }
    },
    
  },
};
