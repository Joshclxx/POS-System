"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { useUserStore } from "@/hooks/useUserSession";
import { LOGIN_SESSION } from "../graphql/mutations";
import { handleGraphQLError } from "../utils/handleGraphqlError";
import bcrypt from "bcryptjs";

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
  const [loginAndRecord] = useMutation(LOGIN_SESSION);
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

  useEffect(() => {
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousDocumentOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousDocumentOverflow;
    };
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
      // const timeNow = new Date().toISOString();
      toast.success("Logged in successfully!", { id: "notif-message" });
      router.push("/admin/user-register");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const { data } = await loginAndRecord({
        variables: {
          data: {
            email: email,
            password: hashedPassword,
            loggedInAt: "login",
          },
        },
      });

      if (data && data.loginAndRecord) {
        const userData: UserData = data.loginAndRecord;
        useUserStore
          .getState()
          .setUser(userData.id, userData.role, email, userData.sessionId);
        toast.success("Logged in successfully!", { id: "notif-message" });
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
      handleGraphQLError(error);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#17110e] p-3 sm:p-4 lg:p-5">
      <Toaster />
      <div className="grid h-full overflow-hidden rounded-[24px] border border-white/10 bg-[#f9f7f4] shadow-2xl lg:grid-cols-[1.08fr_0.92fr]">
        <aside
          className="relative hidden min-h-full overflow-hidden lg:flex lg:flex-col lg:justify-between"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(35, 17, 12, 0.94), rgba(51, 25, 16, 0.68)), url('/image/login-bg-cafe.jpeg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="p-8 text-[#f6eee5] xl:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#deb982]">
              Heebrew Cafe
            </p>
            <p className="mt-4 max-w-xs text-lg leading-8 text-[#f6eee5]/80">
              A calmer way to begin your shift.
            </p>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-10 py-4 xl:px-12">
            <div className="absolute inset-x-14 inset-y-8 rounded-full bg-[#b9793f]/15 blur-3xl" />
            <img
              src="/image/heebrew.png"
              alt="Heebrew Cafe"
              className="relative w-full max-w-md object-contain drop-shadow-2xl"
            />
          </div>

          <p className="p-8 text-xs tracking-wide text-[#f6eee5]/55 xl:p-12">
            Point of Sale · Staff access
          </p>
        </aside>

        <section className="flex h-full items-center justify-center overflow-hidden bg-[#f9f7f4] px-6 py-8 sm:px-12 lg:px-16 xl:px-24">
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6c42]">
                Heebrew Cafe
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#281711] sm:text-4xl">
                Welcome back
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#765f53]">
                Sign in to continue to your workspace.
              </p>
            </div>

            {isLocked && lockEndTime && (
              <div
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                Too many attempts. Try again at {lockEndTime.toLocaleTimeString()}.
              </div>
            )}

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#4b3429]">
                  Email address
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@heebrew.cafe"
                  className="w-full rounded-xl border border-[#dfd4ca] bg-white px-4 py-3 text-[#281711] outline-none transition placeholder:text-[#ad9d92] focus:border-[#9a6c42] focus:ring-4 focus:ring-[#9a6c42]/15"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#4b3429]">
                  Password
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#dfd4ca] bg-white px-4 py-3 text-[#281711] outline-none transition placeholder:text-[#ad9d92] focus:border-[#9a6c42] focus:ring-4 focus:ring-[#9a6c42]/15"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm text-[#765f53]">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4 rounded border-[#cdbdaf] accent-[#79451f]"
              />
              Show password
            </label>

            <button
              type="submit"
              disabled={isLocked}
              className="mt-8 w-full rounded-xl bg-[#4f2d1d] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4f2d1d]/20 transition hover:bg-[#382015] focus:outline-none focus:ring-4 focus:ring-[#9a6c42]/30 disabled:cursor-not-allowed disabled:bg-[#b9aca3] disabled:shadow-none"
            >
              {isLocked ? "Account temporarily locked" : "Sign in"}
            </button>

            <p className="mt-6 text-center text-xs leading-5 text-[#9a887b]">
              Use the staff account assigned by your manager.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
