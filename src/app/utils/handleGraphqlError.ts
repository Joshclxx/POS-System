import {toast} from "react-hot-toast"
import { ApolloError } from "@apollo/client"

export function handleGraphQLError(error: unknown) {
    const apolloError = error as ApolloError;
    const graphQLError = apolloError?.graphQLErrors[0] 
    
    if(graphQLError?.extensions?.code) {
        toast.error(graphQLError.message);
    }else {
        toast.error("An unexpected error occured.")
    }
}