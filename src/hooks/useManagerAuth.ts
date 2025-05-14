"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { USER_LOGIN } from "@/app/graphql/query";
import { useLazyQuery } from "@apollo/client";

type UserData = {
  id: string;
  email: string;
  password: string;
  role: "cashier" | "manager" | "admin";
};

export function useManagerAuth() {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLogin] = useLazyQuery(USER_LOGIN)

  useEffect(() => {
    const stored = localStorage.getItem("isManagerVerified") === "true";
    setIsVerified(stored);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const {data} = await userLogin({
        variables: {
          data: {
            email,
            password
          }
        }
      });

      if(data && data.userLogin) {
        const userData: UserData = data.userLogin;
        const role  = userData.role; 


        if (role === "manager") {
          localStorage.setItem("isManagerVerified", "true");
          localStorage.setItem("userEmail", email);
          setIsVerified(true);
          toast.success("Manager verified!", { id: "manager-verified" });
          return true;
        }
        //if mag try mag login gamit cashier account
        toast.error("Access denied: You're not authorized to use this feature.", { id: "manager-denied" });

        return false;

      }
    } catch (error) {
      console.error(error) //simple error for now
      toast.error("Invalid email or password.", { id: "manager-denied" });
    }

    //Ginamit ko sila sa taas
    // const manager = users.find(
    //   (user: any) =>
    //     user.email.toLowerCase() === email.toLowerCase() &&
    //     user.password === password &&
    //     user.position === "Manager"
    // );

    // if (manager) {
    //   localStorage.setItem("isManagerVerified", "true");
    //   localStorage.setItem("userEmail", email);
    //   setIsVerified(true);
    //   toast.success("Manager verified!", { id: "manager-verified" });
    //   return true;
    // }

    // toast.error("Invalid email or password.", { id: "manager-denied" });
    // return false;
  };

  const logout = () => {
    localStorage.removeItem("isManagerVerified");
    localStorage.removeItem("userEmail");
    setIsVerified(false);
  };

  return { isVerified, loading, login, logout };
}
