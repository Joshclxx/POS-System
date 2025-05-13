"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useManagerAuth() {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("isManagerVerified") === "true";
    setIsVerified(stored);
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

    const manager = users.find(
      (user: any) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password &&
        user.position === "Manager"
    );

    if (manager) {
      localStorage.setItem("isManagerVerified", "true");
      localStorage.setItem("userEmail", email);
      setIsVerified(true);
      toast.success("Manager verified!", { id: "manager-verified" });
      return true;
    }

    toast.error("Invalid email or password.", { id: "manager-denied" });
    return false;
  };

  const logout = () => {
    localStorage.removeItem("isManagerVerified");
    localStorage.removeItem("userEmail");
    setIsVerified(false);
  };

  return { isVerified, loading, login, logout };
}
