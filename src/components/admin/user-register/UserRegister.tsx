"use client";

import React, { useState, useEffect } from "react";
import SectionContainer from "@/components/SectionContainer";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
// import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { GET_ALL_USERS } from "@/app/graphql/query";
import { CREATE_USER } from "@/app/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useUserStore } from "@/hooks/useUserSession";
import { handleGraphQLError } from "@/app/utils/handleGraphqlError";

// Initial form state
const initialForm = {
  firstname: "",
  middlename: "",
  lastname: "",
  suffix: "",
  gender: "",
  role: "", //pinalitan ko muna position into role para mag match sa database
  email: "",
  password: "",
  retypePassword: "",
};

const capitalize = (str: string) => {
  if (!str) return "";

  return str.charAt(0).toUpperCase() + str.slice(1);
};

type User = typeof initialForm;

const UserRegister = () => {
  const [form, setForm] = useState<User>(initialForm);
  const [users, setUsers] = useState<User[]>([]); //useState muna ginamit ko hindi kasi secured ang LocalStorages sa pag save ng passwords
  // const [users, setUsers] = useLocalStorageState<User[]>("registeredUsers", []); //nag cacause sya ng hydration error
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [createUser] = useMutation(CREATE_USER);
  const { data: usersData, refetch } = useQuery(GET_ALL_USERS);

  useEffect(() => {
    if (usersData?.getAllUsers) {
      setUsers(usersData.getAllUsers);
    }
  }, [usersData]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Check form validity
  const isFormValid = () => {
    const {
      firstname,
      middlename,
      lastname,
      gender,
      role,
      email,
      password,
      retypePassword,
    } = form;

    if (
      !firstname ||
      !middlename ||
      !lastname ||
      !gender ||
      !role ||
      !email ||
      !password ||
      !retypePassword
    ) {
      setError("All fields are required to fill out.");
      return false;
    }

    if (password !== retypePassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  };

  // ✅ Save user to localStorage + update state
  const handleRegister = async () => {
    if (!isFormValid()) return;

    // Only allow Cashier or Manager
    if (form.role !== "Cashier" && form.role !== "Manager") {
      setError("Only Cashier and Manager can register.");
      return;
    }

    const existingUsers: User[] = users;

    // const existingUsers: User[] = JSON.parse(
    //   localStorage.getItem("registeredUsers") || "[]"
    // );

    // Prevent duplicate email
    const emailExists = existingUsers.some((user) => user.email === form.email);

    if (emailExists) {
      setError("Email already registered.");
      return;
    }

    try {
      await createUser({
        variables: {
          data: {
            firstname: form.firstname,
            middlename: form.middlename,
            lastname: form.lastname,
            suffix: form.suffix,
            gender: form.gender.toLowerCase(),
            email: form.email,
            password: form.password,
            role: form.role.toLowerCase(),
            // age: Number(form.age),
          },
        },
      });

      //no need for now
      // const updatedUsers = [...existingUsers, form];
      // localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers)); // SAVE to localStorage
      // setUsers(updatedUsers);

      await refetch();
      setForm(initialForm); // Reset form
      setError("");
    } catch (error) {
      handleGraphQLError(error);
    }
  };

  // Reset form
  const handleReset = () => {
    setForm(initialForm);
    setError("");
  };

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <div className="container bg-colorDirtyWhite w-full h-[914px]">
        <div className="grid grid-cols-12 gap-4 p-4">
          {/* LEFT FORM PANEL */}
          <div className="container bg-secondaryGray w-full h-[882px] col-span-4 p-4 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              {/* FIRST NAME */}
              <div>
                <p className="text-primary font-semibold">
                  First Name <span className="text-colorRed">*</span>
                </p>
                <input
                  name="firstname"
                  type="text"
                  placeholder="e.g Joshua"
                  required
                  value={form.firstname}
                  onChange={handleChange}
                  className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                />
              </div>

              {/* MIDDLE NAME */}
              <div>
                <p className="text-primary font-semibold">
                  Middle Name <span className="text-colorRed">*</span>
                </p>
                <input
                  name="middlename"
                  type="text"
                  placeholder="e.g Colobong"
                  value={form.middlename}
                  onChange={handleChange}
                  className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                />
              </div>

              {/* LAST NAME and SUFFIX */}
              <div className="grid grid-cols-6 gap-2">
                <div className="col-span-4">
                  <p className="text-primary font-semibold">
                    Last Name <span className="text-colorRed">*</span>
                  </p>
                  <input
                    name="lastname"
                    type="text"
                    placeholder="e.g Paet"
                    required
                    value={form.lastname}
                    onChange={handleChange}
                    className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                  />
                </div>
                <div className="col-span-2">
                  <p className="text-primary font-semibold">Suffix</p>
                  <input
                    name="suffix"
                    type="text"
                    placeholder="e.g III"
                    value={form.suffix}
                    onChange={handleChange}
                    className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                  />
                </div>
              </div>

              <div>
                <p className="text-primary font-semibold">
                  Gender <span className="text-colorRed">*</span>
                </p>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* POSITION */}
              <div>
                <p className="text-primary font-semibold">
                  Position <span className="text-colorRed">*</span>
                </p>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                >
                  <option value="">Select</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              {/* EMAIL */}
              <div>
                <p className="text-primary font-semibold">
                  Email <span className="text-colorRed">*</span>
                </p>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g joshua@heebrew.employee"
                  value={form.email}
                  required
                  onChange={handleChange}
                  className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <p className="text-primary font-semibold">
                  Password <span className="text-colorRed">*</span>
                </p>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  required
                  onChange={handleChange}
                  className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                />
              </div>

              <div>
                <p className="text-primary font-semibold">
                  Re-type Password <span className="text-colorRed">*</span>
                </p>
                <input
                  type={showPassword ? "text" : "password"}
                  name="retypePassword"
                  placeholder="Re-enter your password"
                  value={form.retypePassword}
                  required
                  onChange={handleChange}
                  className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                />
              </div>

              {/* Show Password Checkbox */}
              <div className="flex items-center gap-2 mt-[-8px]">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="w-4 h-4"
                />
                <label htmlFor="showPassword" className="text-primary text-sm">
                  Show password
                </label>
              </div>

              {error && <p className="text-colorRed text-sm">{error}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                variant="universal"
                onClick={handleReset}
                className="container bg-colorRed w-full h-[42px] rounded-xl"
              >
                Reset
              </Button>
              <Button
                variant="universal"
                onClick={handleRegister}
                className="container bg-colorGreen w-full h-[42px] rounded-xl"
              >
                Register
              </Button>
            </div>
          </div>

          {/* RIGHT TABLE PANEL */}
          <div className="container bg-secondaryGray w-full h-[882px] col-span-8 p-4 overflow-auto">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold text-primary mb-4">
                Registered Users
              </h2>
              <div>
                <Button
                  variant="universal"
                  onClick={() => {
                    useUserStore.getState().logout();
                    router.replace("/login");
                  }}
                  className="bg-colorBlue w-[150px] h-[32px] rounded-xl"
                >
                  Logout
                </Button>
              </div>
            </div>
            <table className="min-w-full table-auto text-primary rounded-md overflow-hidden">
              <thead className="bg-primaryGray">
                <tr>
                  {[
                    "First Name",
                    "Middle Name",
                    "Last Name",
                    "Suffix",
                    "Gender",
                    "Position",
                    "Email",
                    "Password",
                  ].map((header) => (
                    <th
                      key={header}
                      className="border border-primary px-4 py-2"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-secondaryGray">
                {users.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="border border-primary px-4 py-2">
                      {capitalize(user.firstname)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {capitalize(user.middlename)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {capitalize(user.lastname)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {capitalize(user.suffix)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {capitalize(user.gender)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {capitalize(user.role)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {capitalize(user.email)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      ••••••••
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default UserRegister;
