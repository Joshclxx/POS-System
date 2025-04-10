"use client";
import React from "react";
import { useManagerAuth } from "@/hooks/useManagerAuth";

interface ManagerLoginProps {
  onLoginSuccess: () => void;
}

const ManagerLogin = ({ onLoginSuccess }: ManagerLoginProps) => {
  const { email, setEmail, password, setPassword, login } = useManagerAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login();
    if (success) {
      onLoginSuccess(); // Notify parent component of successful login
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-2xl font-bold text-primary mb-4">Manager Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="email"
          placeholder="Manager Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 px-4 py-2 border border-primary rounded w-[500px] text-primary placeholder:text-primary"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 px-4 py-2 border border-primary rounded w-[500px] text-primary placeholder:text-primary"
          required
        />
        <button
          type="submit"
          className="bg-colorBlue text-white px-6 py-2 rounded hover:bg-colorBlueDark transition-all"
        >
          Verify Manager
        </button>
      </form>
    </div>
  );
};

export default ManagerLogin;
