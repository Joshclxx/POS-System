import { useMutation } from "@apollo/client";
import { UPDATE_LOGIN_SESSION } from "../graphql/mutations";
import { handleGraphQLError } from "./handleGraphqlError";
import { useUserStore } from "@/hooks/useUserSession";

export const useLogout = () => {
    const [updateLoginRecord] = useMutation(UPDATE_LOGIN_SESSION);

    const handleLogout = async () => {
        try {
            await updateLoginRecord({variables: {userId: useUserStore.getState().userId}})
            useUserStore.getState().logout()
        } catch (error) {
            handleGraphQLError(error)
        }
    }
    return {handleLogout}
}
