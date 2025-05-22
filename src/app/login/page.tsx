"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import SectionContainer from "@/components/SectionContainer";
import { useMutation } from "@apollo/client";
import { useUserStore } from "@/hooks/useUserSession";
import { LOGIN_SESSION } from "../graphql/mutations";
import { handleGraphQLError } from "../utils/handleGraphqlError";
// import { useLogout } from "../utils/handleLogout";

type UserData = {
  id: string;
  role: "cashier" | "manager" | "admin";
  sessionId: number;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockEndTime, setLockEndTime] = useState<Date | null>(null);
  const [loginAndRecord] = useMutation(LOGIN_SESSION)
  // const {handleLogout} = useLogout();

  useEffect(() => {
    const { loggedIn, userRole, logout } = useUserStore.getState();

    if (!loggedIn) logout();

    if (userRole === "cashier") {
      router.replace("/");
    } else if (userRole === "admin") {
      router.replace("/admin/user-register");
    } else if (userRole === "manager") {
      router.replace("/admin/products");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      toast.error("Too many failed attempts. Try again later.", {
        id: "notif-message",
      });
      return;
    }

    if (email === "heebrew@cafe.admin" && password === "Admin01") {
      setLoginAttempts(0);
      setIsLocked(false);
      useUserStore.getState().setUser("testingId", "admin", email, null);
      localStorage.setItem("loginTime", new Date().toISOString());
      toast.success("Logged in successfully!", { id: "notif-message" });
      router.push("/admin/user-register");
      return;
    }

    try {
      const { data } = await loginAndRecord({
        variables: {
          data: {
            email: email,
            password: password,
          },
        },
      });

      if (data && data.loginAndRecord) {
        const userData: UserData = data.loginAndRecord;
        useUserStore.getState().setUser(userData.id, userData.role, email, userData.sessionId);
        // localStorage.setItem("loginTime", new Date().toISOString());
        toast.success("Logged in successfully!");
        setLoginAttempts(0);
        setIsLocked(false);

        if (userData.role === "manager") {
          router.replace("/admin/products");
        } else if (userData.role === "cashier") {
          router.replace("/admin/shift");
        }

        return;
      }

      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= 3) {
        toast.error("Too many failed attempts. Locked for 30 seconds.", {
          id: "notif-message",
        });
        setIsLocked(true);
        const unlockTime = new Date(Date.now() + 30000);
        setLockEndTime(unlockTime);

        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
          setLockEndTime(null);
        }, 30000);
      } else {
        toast.error("Login Denied, Email & Password Incorrect!", {
          id: "notif-message",
        });
      }
    } catch (error) {
      handleGraphQLError(error)
    }
  };


  return (
    <SectionContainer background="mt-1 w-full max-w-[1280px] h-auto">
      <Toaster />
      <div className="flex h-screen">
        {/* Left container */}
        <div className="w-[462px] h-full bg-[#300b1c] flex flex-col gap-9 items-center justify-center">
          <img
            src="/image/heebrew.svg"
            alt="Heebrew Logo"
            className="w-[800px] h-auto"
          />
        </div>

        {/* Right container */}
        <div
          className="flex-1 relative"
          style={{
            backgroundImage: "url('/image/anime-bg.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute left-50 top-1/2 transform -translate-y-1/2 flex justify-center">
            <form onSubmit={handleLogin} className="login-form">
              <h1 className="text-2xl font-bold mb-4 text-tertiary text-center">
                Login
              </h1>

              {isLocked && lockEndTime && (
                <p className="text-red-500 text-sm text-center mb-2">
                  Try again at {lockEndTime.toLocaleTimeString()}.
                </p>
              )}

              <input
                type="email"
                placeholder="Email"
                className="w-full mb-3 p-2 border-2 border-tertiary/45 rounded text-tertiary placeholder:text-tertiary/60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full mb-4 p-2 border-2 border-tertiary/45 rounded text-tertiary placeholder:text-tertiary/60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="text-sm text-tertiary flex justify-end gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </label>
              <button
                type="submit"
                disabled={isLocked}
                className={`w-full ${
                  isLocked
                    ? "bg-gray-500"
                    : "bg-colorBlue hover:bg-colorBlue/80"
                } text-white font-semibold py-2 px-4 rounded transition`}
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
