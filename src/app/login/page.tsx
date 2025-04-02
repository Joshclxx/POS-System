"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SectionContainer from "@/components/SectionContainer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Dummy auth logic — replace with your own
    if (email === "heebrew@cafe.com" && password === "heebrew") {
      router.push("/"); // Redirect to home or dashboard
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <SectionContainer background="mt-1 w-full max-w-[1280px] h-[914px]">
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
        <div className="flex-1 flex flex-col items-center justify-start bg-[#E0E0E0] pt-12">
          {/* Title at the top */}
          <div className="text-primary text-[32px] text-center mb-12 font-semibold leading-loose tracking-widest">
            <p>HEEBREW CAFE</p>
            <p>POS SYSTEM</p>
          </div>

          {/* Login form */}
          <div className="flex-1 flex flex-col items-center justify-center bg-[#E0E0E0]">
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
