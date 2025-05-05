import { GraphQLContext } from "@/app/lib/context";

export const mutationResolvers = {
  
    Mutation: {
        //CREATE MUTATION----------------------------------------------------------------------------------------------------------------------------------
        createUser: async (_: unknown, args: {data: {firstname: string, middlename: string, lastname: string, age: number, email: string, password: string, role: "CASHIER" | "MANAGER" | "ADMIN",}}, context: GraphQLContext) => {
            const { firstname, middlename, lastname, age, email, password, role} = args.data;
            const userData = {
                firstname,
                middlename,
                lastname,
                age,
                email,
                password,
                role
            }

            try{
                return await context.prisma.user.create({data: userData})

            }catch(error: unknown){
                if(error instanceof Error){

                    if(error.message.includes("database")){
                        try {       
                            await context.prisma.$connect();
                            return await context.prisma.user.create({data: userData})
                        } catch (reconnectError: unknown) {
                            if(reconnectError instanceof Error) {
                                throw new Error(`Failed to connect database: ${reconnectError.message}`);
                            }
                            throw new Error("Database is unreachable");
                        }
                    }
                    throw new Error(`Failed to create user: ${error.message}`)

                }
                throw new Error("An unkown error occured while creating user.")
            }
        },

        createCategory: async (_: unknown, args: {data:{name: string}}, context: GraphQLContext) => {
            try {
                return await context.prisma.category.create({data: {name: args.data.name}})
            } catch (error: unknown) {
                if(error instanceof Error) {
                    
                    if(error.message.includes("database")) {
                        try {
                            await context.prisma.$connect();
                            return await context.prisma.category.create({data: {name: args.data.name}});

                        } catch (reconnectError: unknown) {
                            if(reconnectError instanceof Error) {
                                throw new Error(`Failed to connect database: ${reconnectError.message}`);
                            }
                            throw new Error("Database is unreachable.");
                        }
                    }
                    throw new Error(`Failed to create category: ${error.message}`);

                }
                throw new Error("An unknown error occured while creating category.");
            }
        },

        createProduct: async (_: unknown, args: {data: {name: string, variants: {size: string, price: number}[], categoryId: number}}, context: GraphQLContext) => {
            const {name, variants, categoryId} = args.data;

            const productData = {
                name,
                variants: {
                    createMany: {
                        data: variants,
                        skipDuplicates: true,
                    },
                },
                category: {
                    connect: {id: categoryId}
                }
            } 

            const includeData = {
                variants: true,
                category: true
            }
            
            try {
                return await context.prisma.product.create({data: productData, include: includeData})

            } catch (error: unknown) {
                if(error instanceof Error) {
                    
                    if(error.message.includes("database")) {
                        try {
                            await context.prisma.$connect();
                            return await context.prisma.product.create({data: productData});

                        } catch (reconnectError: unknown) {
                            if(reconnectError instanceof Error) {
                                throw new Error(`Failed to connect database: ${reconnectError.message}`);
                            }
                            throw new Error("Database is unreachable.");
                        }
                    }
                    throw new Error(`Failed to create product: ${error.message}`);

                }
                throw new Error("An unknown error occured while creating product.");
            }
        },
        

    }
}