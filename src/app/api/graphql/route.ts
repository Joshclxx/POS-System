import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "@/app/graphql/schema";  // Import the GraphQL schema
import { query } from "@/app/graphql/resolvers/query";  // Import the resolvers
import { context } from "@/app/lib/context";  // Import the context from context.ts

const resolvers = {
    ...query,
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,  // This injects the context with Prisma client into the server
});

export default server.createHandler({
  path: "/api/graphql",  // Set the path for the GraphQL endpoint
});
