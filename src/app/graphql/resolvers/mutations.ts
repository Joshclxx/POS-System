import { GraphQLContext } from "@/app/lib/context";

export const mutationResolvers = {
    Mutation: {
        createUser: async (_: unknown, args: {firstname: string, middlename: string, lastname: string, age: number, email: string, password: string, role: string}, context: GraphQLContext) => {
            try{
                const { firstname, middlename, lastname, age, email, password, role} = args;

                return await context.prisma.user.create({
                    data: {
                        firstname,
                        middlename,
                        lastname,
                        age,
                        email,
                        password,
                        role: role as "CASHIER" | "MANAGER" | "ADMIN",
                    }
                })

            }catch(error: unknown){
                if(error instanceof Error){
                    if(error.message.includes("connection")){
                        await context.prisma.$connect()
                    }
                    throw new Error(`Failed to crate user: ${error.message}`)
                }
                throw new Error("An unkown error occured while creating user.")
            }
        }
    }
}