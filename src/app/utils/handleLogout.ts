import { useMutation } from "@apollo/client";
import { UPDATE_LOGIN_SESSION } from "../graphql/mutations";
import { handleGraphQLError } from "./handleGraphqlError";
import { useUserStore } from "@/hooks/useUserSession";
import { Toaster, toast } from "react-hot-toast";

export const useLogout = () => {
  const [updateLoginRecord] = useMutation(UPDATE_LOGIN_SESSION);
  const userId = useUserStore((state) => state.userId);
  const handleLogout = async () => {
    //Show loading if
    if (!userId) {
      toast.success("Loading...");
    }

    //wait data before validation
    if (userId) {
      try {
        await updateLoginRecord({
          variables: { userId: userId },
        });
        useUserStore.getState().logout();
      } catch (error) {
        handleGraphQLError(error);
      }
    }
  };

  return { handleLogout };
};
