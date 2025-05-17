import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/app/graphql/schema";
import { query } from "@/app/graphql/resolvers/query";
import { mutationResolvers } from "@/app/graphql/resolvers/mutations";
import { context } from "@/app/lib/context";
import { categoryMutations } from "@/app/graphql/resolvers/mutations/category";

const resolvers = {
  Query: {
    ...query.Query, // Make sure you use the Query object inside query resolver
  },
  Mutation: {
    ...mutationResolvers.Mutation, 
    ...categoryMutations.Mutation,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async () => context,
});

export { handler as GET, handler as POST };
