"use client";
import React from "react";
import { useManagerAuth } from "@/hooks/useManagerAuth";

const ManagerLogin = () => {
  const { email, setEmail, password, setPassword, login } = useManagerAuth();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-2xl font-bold text-primary mb-4">Manager Login</h2>
      <input
        type="email"
        placeholder="Manager Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 px-4 py-2 border border-primary rounded w-[500px] text-primary placeholder:text-primary"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 px-4 py-2 border border-primary rounded w-[500px] text-primary placeholder:text-primary"
      />
      <button
        onClick={login}
        className="bg-colorBlue text-white px-6 py-2 rounded hover:bg-colorBlueDark transition-all"
      >
        Verify Manager
      </button>
    </div>
  );
};

export default ManagerLogin;
