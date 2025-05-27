import { GraphQLError } from "graphql";
import { GraphQLContext } from "@/app/lib/context";

export const loginMutation = {
  Mutation: {
    loginAndRecord: async (
      _: unknown,
      args: { data: { email: string; password: string } },
      context: GraphQLContext
    ) => {
      const { email, password } = args.data;

      const userDataFormat = async () => {
        const user = await context.prisma.user.findUnique({ where: { email } });

        if (!user || user.password !== password) {
          throw new GraphQLError("Login Denied, Email or Password Incorrect!", {
            extensions: {
              code: "LOGIN_FAILED",
            },
          });
        }

        const loginSession = await context.prisma.loginHistory.create({
          data: { userId: user.id, timeIn: new Date() },
        });

        return {
          id: user.id,
          role: user.role,
          sessionId: loginSession?.id,
        };
      };

      try {
        return await userDataFormat();
      } catch (error: unknown) {
        if (error instanceof GraphQLError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await userDataFormat();
            } catch (reconnectError: unknown) {
              if (reconnectError instanceof Error) {
                throw new GraphQLError(
                  "Failed to connect database. Make sure your database are running.",
                  {
                    extensions: {
                      code: "FAILED_RECONNECTION_DB",
                    },
                  }
                );
              }

              throw new GraphQLError(
                "Database is unreachable. Make sure your database are running.",
                {
                  extensions: {
                    code: "NO_DATABASE_FOUND",
                  },
                }
              );
            }
          }
          throw new GraphQLError(
            "Something went wrong. Please contact your administrator.",
            {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            }
          );
        }
        throw new GraphQLError(
          "An unknown error occured while trying to login an user.",
          {
            extensions: {
              code: "UNKNOWN_LOGIN_ERROR",
            },
          }
        );
      }
    },

    updateLoginRecord: async (
      _: unknown,
      { userId }: { userId: string },
      context: GraphQLContext
    ) => {
      const updateLogin = async () => {
        const loginHistory = await context.prisma.loginHistory.findFirst({
          where: { userId, timeOut: null },
          orderBy: { timeIn: "desc" },
        });

        if (!loginHistory) {
          throw new GraphQLError(
            "No active login session found for this user.",
            {
              extensions: {
                code: "NO_ACTIVE_LOGIN_SESSION",
              },
            }
          );
        }

        return await context.prisma.loginHistory.update({
          where: { id: loginHistory.id },
          data: { timeOut: new Date() },
        });
      };

      try {
        return await updateLogin();
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await updateLogin();
            } catch (reconnectError: unknown) {
              if (reconnectError instanceof Error) {
                throw new GraphQLError(
                  "Failed to connect database. Make sure your database are running.",
                  {
                    extensions: {
                      code: "FAILED_RECONNECTION_DB",
                    },
                  }
                );
              }

              throw new GraphQLError(
                "Database is unreachable. Make sure your database are running.",
                {
                  extensions: {
                    code: "NO_DATABASE_FOUND",
                  },
                }
              );
            }
          }
          throw new GraphQLError(
            "Something went wrong. Please contact your administrator.",
            {
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            }
          );
        }
        throw new GraphQLError(
          "An unknown error occured while trying to login an user.",
          {
            extensions: {
              code: "UNKNOWN_LOGIN_ERROR",
            },
          }
        );
      }
    },
  },
};
