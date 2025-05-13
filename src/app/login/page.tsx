"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import SectionContainer from "@/components/SectionContainer";
import { USER_LOGIN } from "../graphql/query";
import { useLazyQuery } from "@apollo/client";

type UserData = {
  id: string,
  email: string,
  password: string,
  role: "cashier" | "manager" | "admin"
}
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [userLogin] = useLazyQuery(USER_LOGIN);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const {data} = await userLogin({
      variables: {
        data: {
          email: email,
          password: password,
        }
      }
    });

    if(data && data.userLogin) {
      const userData: UserData = data.userLogin;
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", userData.role);

      toast.success("Logged in successfully!");

      if (data.position === "manager") {
        router.push("/admin/products");
      } else if (userData.role === "cashier") {
        router.push("/admin/shift");
      } 

      return; // prevent falling through to admin check

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
    
    if (email.toLowerCase() === "heebrew@cafe.admin" && password === "Admin01") {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", "admin");
      toast.success("Logged in successfully!");
      router.push("/admin/user-register");
      return; // ✅ stop here
    }

    toast.error("Login Denied, Email & Password Incorrect!");
  };

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

  // LOCAL LOGIN CREDENTIALS

  //   if (email === "heebrew@cafe.employee" && password === "Employee01") {
  //     localStorage.setItem("loggedIn", "true");
  //     localStorage.setItem("userEmail", email);
  //     localStorage.setItem("userRole", "employee");
  //     toast.success("Logged in successfully!");
  //     router.push("/admin/shift");
  //   } else if (email === "heebrew@cafe.manager" && password === "Manager01") {
  //     localStorage.setItem("loggedIn", "true");
  //     localStorage.setItem("userEmail", email);
  //     localStorage.setItem("userRole", "manager");
  //     toast.success("Logged in successfully!");
  //     router.push("/admin/products");
  //   } else if (email === "heebrew@cafe.admin" && password === "Admin01") {
  //     localStorage.setItem("loggedIn", "true");
  //     localStorage.setItem("userEmail", email);
  //     localStorage.setItem("userRole", "admin");
  //     toast.success("Logged in successfully!");
  //     router.push("/admin/user-register");
  //   } else {
  //     toast.error("Login Denied, Email & Password Incorrect!");
  //   }
  // };

  return (
    <SectionContainer background="mt-1 w-full max-w-[1280px] h-auto">
      <Toaster />
      <div className="flex h-screen">
        {/* Left container */}
        <div className="w-[462px] h-full bg-secondary flex flex-col gap-9 items-center justify-center">
          <img
            src="/image/heebrew-logo.svg"
            alt="Heebrew Logo"
            className="w-[400px] h-auto"
          />
          <div className="pt-12 text-[32px] text-center font-semibold leading-loose tracking-widest">
            <p className="text-tertiary/70">HEEBREW CAFE POS SYSTEM</p>
          </div>
        </div>

        {/* Right container */}
        <div
          className="flex-1 relative"
          style={{
            backgroundImage: "url('/image/login-bg-cafe.jpeg')",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Title at the top */}
          {/* <div className="pt-12 container bg-secondaryGray/40 text-[32px] text-center font-semibold leading-loose tracking-widest">
            <p className="text-primary">HEEBREW CAFE POS SYSTEM</p>
          </div> */}
          <div className="absolute left-50 top-1/2 transform -translate-y-1/2 flex justify-center">
            <form onSubmit={handleLogin} className="login-form">
              <h1 className="text-2xl font-bold mb-4 text-primary text-center">
                Login
              </h1>
              <input
                type="email"
                placeholder="Email"
                className="w-full mb-3 p-2 border border-primaryGray rounded text-primary placeholder:text-tertiary/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type={showPassword ? "text" : "password"} // <-- dynamic type
                placeholder="Password"
                className="w-full mb-4 p-2 border border-primaryGray rounded text-primary placeholder:text-tertiary/50"
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
