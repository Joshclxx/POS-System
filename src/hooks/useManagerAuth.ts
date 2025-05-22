"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { LOGIN_SESSION, UPDATE_LOGIN_SESSION } from "@/app/graphql/mutations";
import { useMutation } from "@apollo/client";
import { handleGraphQLError } from "@/app/utils/handleGraphqlError";

type UserData = {
  id: string;
  role: "cashier" | "manager" | "admin";
};

export function useManagerAuth() {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoginRecord] = useMutation(UPDATE_LOGIN_SESSION)
  const [loginAndRecord] = useMutation(LOGIN_SESSION)

  useEffect(() => {
    const stored = localStorage.getItem("isManagerVerified") === "true";
    setIsVerified(stored);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const {data} = await loginAndRecord({
        variables: {
          data: {
            email,
            password
          }
        }
      });

      if(data && data.loginAndRecord) {
        const userData: UserData = data.loginAndRecord;
        const role  = userData.role; 


        if (role === "manager") {
          localStorage.setItem("isManagerVerified", "true");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userId", userData.id);
          setIsVerified(true);
          toast.success("Manager verified!", { id: "manager-verified" });
          return true;
        }

        toast.error("Access denied: You're not authorized to use this feature.", { id: "manager-denied" });
        return false;

      }
    } catch (error) {
      handleGraphQLError(error);
    }

  };

  const logout = () => {
    updateLoginRecord({variables: {userId: localStorage.getItem("userId")}})
    localStorage.removeItem("userId")
    localStorage.removeItem("isManagerVerified");
    localStorage.removeItem("userEmail");
    setIsVerified(false);
  };

  return { isVerified, loading, login, logout };
}
