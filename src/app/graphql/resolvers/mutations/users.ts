import { GraphQLContext } from "@/app/lib/context";
import { GraphQLError } from "graphql";

export const usersMutation = {
  Mutation: {
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
      const {
        firstname,
        middlename,
        lastname,
        suffix,
        gender,
        email,
        password,
        role,
      } = args.data;

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
          if (error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.user.create({ data: userData });
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
          "An unknown error occured while creating an user.",
          {
            extensions: {
              code: "UNKNOWN_CREATE_USER_ERROR",
            },
          }
        );
      }
    },

    deleteUser: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!id) {
        throw new GraphQLError("No userId");
      }

      try {
        return await context.prisma.user.delete({ where: { id } });
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message.includes("connect")) {
            try {
              await context.prisma.$connect();
              return await context.prisma.user.delete({ where: { id } });
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
          "An unknown error occured while deleting an user.",
          {
            extensions: {
              code: "UNKNOWN_CREATE_USER_ERROR",
            },
          }
        );
      }
    },

    updateUser: async (
      _: unknown,
      args: {
        id: string;
        edits: {
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
      const {
        firstname,
        middlename,
        lastname,
        suffix,
        gender,
        email,
        password,
        role,
      } = args.edits;
      const dataFormat = {
        firstname: firstname.toLowerCase(),
        middlename: middlename.toLowerCase(),
        lastname: lastname.toLowerCase(),
        suffix: suffix ? suffix.toLowerCase() : "N/A",
        gender,
        email: email.toLowerCase(),
        password,
        role,
      };

      const fetchUser = () => {
        return context.prisma.user.findUnique({ where: { id: args.id } });
      };

      const updateLogic = async () => {
        const user = await fetchUser();

        if (!user) throw new Error("USER NOT FOUND");

        // HAHAHAHAHAHAHA sinubukan ko paiklin gamit for loop sa object kaso nag eerror di ko ma fix kaya ito nalang muna
        if (firstname && firstname !== user.firstname)
          await context.prisma.user.update({
            where: { id: user.id },
            data: { firstname: dataFormat.firstname },
          });
        if (middlename && middlename !== user.middlename)
          await context.prisma.user.update({
            where: { id: user.id },
            data: { middlename: dataFormat.middlename },
          });
        if (lastname && lastname !== user.lastname)
          await context.prisma.user.update({
            where: { id: user.id },
            data: { lastname: dataFormat.lastname },
          });
        if (suffix && suffix !== user.suffix)
          await context.prisma.user.update({
            where: { id: user.id },
            data: { suffix: dataFormat.suffix },
          });
        if (gender && gender !== user.gender)
          await context.prisma.user.update({
            where: { id: user.id },
            data: { gender: dataFormat.gender },
          });
        if (email && email !== user.email)
          await context.prisma.user.update({
            where: { id: user.id },
            data: { email: dataFormat.email },
          });
        if (password && password !== user.password)
          await context.prisma.user.update({
            where: { id: user.id },
            data: { password: dataFormat.password },
          });
        if (role && role !== user.role)
          await context.prisma.user.update({
            where: { id: user.id },
            data: { role: dataFormat.role },
          });

        return await fetchUser();
      };

      try {
        return await updateLogic();
      } catch (error) {
        console.error(error); //temporary error
      }
    },

    createUserShift: async (
      _: unknown,
      args: {
        data: {
          loginHistoryId: number;
          startingCash: number;
          userId: string;
        };
      },
      context: GraphQLContext
    ) => {
      const { loginHistoryId, startingCash, userId } = args.data;
      const getShiftType = (): "opening" | "closing" => {
        const hour = new Date().getHours();
        return hour >= 8 && hour < 20 ? "opening" : "closing";
      };
      const shiftType = getShiftType();
      const shiftData = {
        shiftType,
        loginHistoryId,
        startingCash,
        userId,
      };

      try {
        return await context.prisma.shift.create({ data: shiftData });
      } catch (error) {
        console.error(error);
      }
    },

    updateUserShift: async (
      _: unknown,
      args: {
        data: {
          loginHistoryId: number;
          cashpickAmount: number;
          voidedAmount: number;
          totalSales: number;
        };
      },
      context: GraphQLContext
    ) => {
      const { loginHistoryId, cashpickAmount, voidedAmount, totalSales } =
        args.data;
      try {
        return context.prisma.shift.update({
          where: { loginHistoryId },
          data: {
            cashpickAmount,
            voidedAmount,
            totalSales,
          },
        });
      } catch (error) {
        console.error(error); // simple error for now
      }
    },

    createSpotCheck: async (
      _: unknown,
      args: {
        data: { userId: string; currentCash: number; actualCash: number };
      },
      context: GraphQLContext
    ) => {
      const { userId, currentCash, actualCash } = args.data;

      try {
        return await context.prisma.spotcheck.create({
          data: {
            userId,
            currentCash,
            actualCash,
          },
        });
      } catch (error) {
        console.error(error); // simple error for now
      }
    },
  },
};
