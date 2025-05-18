"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import SectionContainer from "@/components/SectionContainer";
import { USER_LOGIN } from "../graphql/query";
import { useLazyQuery } from "@apollo/client";
import { useUserStore } from "@/hooks/useUserSession";

type UserData = {
  id: string;
  email: string;
  password: string;
  role: "cashier" | "manager" | "admin";
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [userLogin] = useLazyQuery(USER_LOGIN);
  const [showPassword, setShowPassword] = useState(false);

  //automatically go to main ui pag naka loggedIn na, to avoid showing close shift
  useEffect(() => {
    if(useUserStore.getState().loggedIn && useUserStore.getState().userRole === "cashier") {
      router.push("/")
    }
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "heebrew@cafe.admin" && password === "Admin01") {
      useUserStore.getState().setUser("testingId", "admin", email);
      localStorage.setItem("loginTime", new Date().toISOString());
      toast.success("Logged in successfully!");
      router.push("/admin/user-register");
    } else {
      try {
        //find user
        const { data } = await userLogin({
          variables: {
            data: {
              email: email,
              password: password,
            },
          },
        });

        if (data && data.userLogin) {
          const userData: UserData = data.userLogin;
          useUserStore.getState().setUser(userData.id, userData.role, email);
          localStorage.setItem("loginTime", new Date().toISOString());
          toast.success("Logged in successfully!");

          if (userData.role === "manager") {
            router.push("/admin/products");
          } else if (userData.role === "cashier") {
            router.push("/admin/shift");
          }

          return; // prevent falling through to admin check
        }
        
        toast.error("Login Denied, Email & Password Incorrect!");
      } catch (error) {
        console.log(error); //simple error for now
      }
    }

    // const storedUsers = JSON.parse(
    //   localStorage.getItem("registeredUsers") || "[]"
    // );

    // const foundUser = storedUsers.find(
    //   (user: any) => user.email === email && user.password === password
    // );

    // if (foundUser) {
    //   localStorage.setItem("loggedIn", "true");
    //   localStorage.setItem("userEmail", email);
    //   localStorage.setItem("userRole", foundUser.position.toLowerCase());

    //   toast.success("Logged in successfully!");

    //   if (foundUser.position === "Manager") {
    //     router.push("/admin/products");
    //   } else if (foundUser.position === "Cashier") {
    //     router.push("/admin/shift");
    //   }

    //   return; // prevent falling through to admin check
    // }

    // Default Admin Login

    // FINAL CODE
    //   if (
    //     email.toLowerCase() === "heebrew@cafe.admin" &&
    //     password === "Admin01"
    //   ) {
    //     localStorage.setItem("loggedIn", "true");
    //     localStorage.setItem("userEmail", email);
    //     localStorage.setItem("userRole", "admin");
    //     toast.success("Logged in successfully!");
    //     router.push("/admin/user-register");
    //     return; // ✅ stop here
    //   }

    //   toast.error("Login Denied, Email & Password Incorrect!");
    // };

    // const { data } = await userLogin({
    //   variables: {
    //     data: {
    //       email: email,
    //       password: password,
    //     },
    //   },
    // });

    // DATABASE LOGIN CREDENTIALS

    // if (data && data.userLogin) {
    //   localStorage.setItem("loggedIn", "true");
    //   localStorage.setItem("userEmail", email);
    //   localStorage.setItem("userRole", data.userLogin.role);
    //   toast.success("Logged in successfully!");

    //   if (data.userLogin.role === "manager") {
    //     router.push("/admin/user-register");
    //   } else if (data.userLogin.role === "employee") {
    //     router.push("/homepage");
    //   } else {
    //     toast.error("Unknown role");
    //   }
    // } else {
    //   toast.error("Login Denied, Email & Password Incorrect!");
    // }

    // LOCAL LOGIN CREDENTIALS
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
          {/* <div className="pt-12 text-[32px] text-center font-semibold leading-loose tracking-widest">
            <p className="text-tertiary/70">POS SYSTEM</p>
          </div> */}
        </div>

        {/* Right container */}
        <div
          className="flex-1 relative"
          style={{
            backgroundImage: "url('/image/anime-bg.png')",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute left-50 top-1/2 transform -translate-y-1/2 flex justify-center">
            <form onSubmit={handleLogin} className="login-form">
              <h1 className="text-2xl font-bold mb-4 text-tertiary text-center">
                Login
              </h1>
              <input
                type="email"
                placeholder="Email"
                className="w-full mb-3 p-2 border-2 border-primary rounded text-tertiary placeholder:text-tertiary/60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type={showPassword ? "text" : "password"} // <-- dynamic type
                placeholder="Password"
                className="w-full mb-4 p-2 border-2 border-primary rounded text-tertiary placeholder:text-tertiary/60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
