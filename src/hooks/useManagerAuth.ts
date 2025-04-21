// src/hooks/useManagerAuth.ts
"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useManagerAuth() {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("isManagerVerified") === "true";
    setIsVerified(stored);
  }, []);

  const login = (email: string, password: string) => {
    if (email === "heebrew@cafe.manager" && password === "Manager01") {
      localStorage.setItem("isManagerVerified", "true");
      setIsVerified(true);
      toast.success("Manager verified!");
      return true;
    }
    toast.error("Invalid email or password.");
    return false;
  };

  const logout = () => {
    localStorage.removeItem("isManagerVerified");
    setIsVerified(false);
  };

  return { isVerified, login, logout };
}
