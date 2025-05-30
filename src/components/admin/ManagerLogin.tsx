"use client";
import React, { useState } from "react";

// removed for a while
// import { useRouter } from "next/navigation";

interface Props {
  onLoginSuccess: (email: string, password: string) => void;
}

const ManagerLogin = ({ onLoginSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // removed for a while
  // const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(email, password); //pass this to parent  for validation
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
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 px-4 py-2 border border-primary rounded w-[500px] text-primary placeholder:text-primary"
            required
          />
          <label className="text-sm text-primary flex justify-end gap-2 mb-4">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>
        </div>
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
