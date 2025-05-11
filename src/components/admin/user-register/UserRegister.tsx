"use client";

import React, { useState } from "react";
import SectionContainer from "@/components/SectionContainer";
import Button from "@/components/Button";

const initialForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  gender: "",
  position: "",
  email: "",
  password: "",
  retypePassword: "",
};

type User = typeof initialForm;

const UserRegister = () => {
  const [form, setForm] = useState<User>(initialForm);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    const {
      firstName,
      lastName,
      gender,
      position,
      email,
      password,
      retypePassword,
    } = form;

    if (
      !firstName ||
      !lastName ||
      !gender ||
      !position ||
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

  const handleRegister = () => {
    if (!isFormValid()) return;

    const newUser = { ...form };
    setUsers([...users, newUser]);
    setForm(initialForm);
  };

  const handleReset = () => {
    setForm(initialForm);
    setError("");
  };

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <div className="container bg-colorDirtyWhite w-full h-[914px]">
        <div className="grid grid-cols-12 gap-4 p-4">
          {/* LEFT CONTAINER */}
          <div className="container bg-secondaryGray w-full h-[882px] col-span-4 p-4 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              {/* FIRST NAME */}
              <div>
                <p className="text-primary font-semibold">First Name *</p>
                <input
                  name="firstName"
                  type="text"
                  placeholder="e.g Joshua"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                />
              </div>

              {/* MIDDLE NAME */}
              <div>
                <p className="text-primary font-semibold">Middle Name</p>
                <input
                  name="middleName"
                  type="text"
                  placeholder="e.g Colobong"
                  value={form.middleName}
                  onChange={handleChange}
                  className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                />
              </div>

              {/* LAST NAME and SUFFIX */}
              <div className="grid grid-cols-6 gap-2">
                <div className="col-span-4">
                  <p className="text-primary font-semibold">Last Name *</p>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="e.g Paet"
                    required
                    value={form.lastName}
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

              {/* GENDER */}
              <div>
                <p className="text-primary font-semibold">Gender *</p>
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
                <p className="text-primary font-semibold">Position *</p>
                <select
                  name="position"
                  value={form.position}
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
                <p className="text-primary font-semibold">Email *</p>
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
              {/* PASSWORD and RE-TYPE PASSWORD */}
              <div>
                <p className="text-primary font-semibold">Password *</p>
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
                <p className="text-primary font-semibold">Re-type Password *</p>
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

              {/* CHECK BOX */}
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

            {/* BUTTON */}
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

          {/* RIGHT CONTAINER: TABLE */}
          <div className="container bg-secondaryGray w-full h-[882px] col-span-8 p-4 overflow-auto">
            <h2 className="text-lg font-bold text-primary mb-4">
              Registered Users
            </h2>
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
                      {user.firstName}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {user.middleName}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {user.lastName}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {user.suffix}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {user.gender}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {user.position}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {user.email}
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
