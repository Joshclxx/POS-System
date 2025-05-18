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
            const { firstname, middlename, lastname, suffix, gender, email, password, role } = args.data;

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
                throw new GraphQLError("An unknown error occured while creating an user.", {
                    extensions: {
                        code: "UNKNOWN_CREATE_USER_ERROR"
                    }
                });
            }
        },
    }
}