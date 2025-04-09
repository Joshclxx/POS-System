import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useManagerAuth() {
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const verified = localStorage.getItem("isManagerVerified");
    if (verified === "true") {
      setIsVerified(true);
    }
  }, []);

  const login = () => {
    // Ideally, validate from a database or secure source
    if (email === "heebrew@cafe.manager" && password === "Manager01") {
      setIsVerified(true);
      localStorage.setItem("isManagerVerified", "true");
      toast.success("Manager verified!");
    } else {
      toast.error("Invalid email or password.");
    }
  };

  const logout = () => {
    setIsVerified(false);
    localStorage.removeItem("isManagerVerified");
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
