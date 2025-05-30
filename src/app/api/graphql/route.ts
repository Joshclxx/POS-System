
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";

import { typeDefs } from "@/app/graphql/schema";
import { context } from "@/app/lib/context";
import { categoryMutations } from "@/app/graphql/resolvers/mutations/categories";
import { usersMutation } from "@/app/graphql/resolvers/mutations/users";
import { productMutation } from "@/app/graphql/resolvers/mutations/products";
import { ordersMutation } from "@/app/graphql/resolvers/mutations/orders";
import { usersQuery } from "@/app/graphql/resolvers/query/users";
import { productsQuery } from "@/app/graphql/resolvers/query/products";
import { categoriesQuery } from "@/app/graphql/resolvers/query/categories";
import { ordersQuery } from "@/app/graphql/resolvers/query/orders";
import { loginMutation } from "@/app/graphql/resolvers/mutations/login";

const resolvers = {
  Query: {
    ...usersQuery.Query,
    ...productsQuery.Query,
    ...categoriesQuery.Query,
    ...ordersQuery.Query,
  },
  Mutation: {
    ...categoryMutations.Mutation,
    ...usersMutation.Mutation,
    ...productMutation.Mutation,
    ...ordersMutation.Mutation,
    ...loginMutation.Mutation
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async () => context,
});

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
