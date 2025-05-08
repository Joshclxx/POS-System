"use client";

import React, { useState } from "react";
import SectionContainer from "../SectionContainer";
import toast from "react-hot-toast";
import { useManagerAuth } from "@/hooks/useManagerAuth";

interface Props {
  onSuccess: () => void;
}

const ManagerPasswordOnlyLogin: React.FC<Props> = ({ onSuccess }) => {
  const { login } = useManagerAuth();
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login("heebrew@cafe.manager", password); // hardcoded email
    if (success) onSuccess();
  };

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="text-2xl font-bold text-primary mb-8">
          Manager Password Required
        </h2>

        <div className="grid grid-cols-3 w-full">
          <div />
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="password"
              placeholder="Enter Manager Password"
              className="w-full px-4 py-2 border border-primary rounded mb-4 text-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-colorBlue text-white py-2 rounded hover:bg-colorBlueDark"
            >
              Verify
            </button>
          </form>
          <div />
        </div>
      </div>
    </SectionContainer>
  );
};

export default ManagerPasswordOnlyLogin;
