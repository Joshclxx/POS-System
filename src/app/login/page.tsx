"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import SectionContainer from "@/components/SectionContainer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "heebrew@cafe.employee" && password === "Employee01") {
      localStorage.setItem("loggedIn", "true");
      toast.success("Logged in successfully!");
      router.push("/admin/shift");
    } else {
      toast.error("Login Denied, Email & Password Incorrect!");
    }
  };

  return (
    <SectionContainer background="mt-1 w-full max-w-[1280px] h-[914px]">
      <Toaster />
      <div className="flex h-screen">
        {/* Left container */}
        <div className="w-[462px] h-full bg-secondary flex items-center justify-center">
          <img
            src="/image/heebrew-logo.svg"
            alt="Heebrew Logo"
            className="w-[400px] h-auto"
          />
        </div>

        {/* Right container */}
        <div className="flex-1 relative bg-[#E0E0E0]">
          {/* Title at the top */}
          <div className="pt-12 text-primary text-[32px] text-center font-semibold leading-loose tracking-widest">
            <p>HEEBREW CAFE POS SYSTEM</p>
          </div>
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-center">
            <form
              onSubmit={handleLogin}
              className="bg-primaryGray p-6 rounded-lg shadow-[0_4px_12px_2px_#131A15] w-full max-w-sm"
            >
              <h1 className="text-2xl font-bold mb-4 text-primary text-center">
                Login
              </h1>
              <input
                type="email"
                placeholder="Email"
                className="w-full mb-3 p-2 border border-colorDirtyWhite rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full mb-4 p-2 border border-colorDirtyWhite rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-colorBlue hover:bg-colorBlue/80 text-white font-semibold py-2 px-4 rounded"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
