"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useManagerAuth() {
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Initialize state from localStorage and set up sync
  useEffect(() => {
    const storedValue = localStorage.getItem("isManagerVerified") === "true";
    setIsVerified(storedValue);

    const handleStorageChange = () => {
      const newValue = localStorage.getItem("isManagerVerified") === "true";
      setIsVerified(newValue);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = () => {
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

  return {
    isVerified,
    email,
    setEmail,
    password,
    setPassword,
    login,
    logout,
  };
}
