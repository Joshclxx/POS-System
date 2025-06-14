// This component allows registering, updating, and deleting users (Cashier/Manager).
// It displays a form on the left for input and a user list on the right. Clicking a user opens a modal for edit/delete actions.

"use client";

import React, { useState, useEffect } from "react";
import SectionContainer from "@/components/SectionContainer";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { GET_ALL_USERS } from "@/app/graphql/query";
import { CREATE_USER, UPDATE_USER, DELETE_USER } from "@/app/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { handleGraphQLError } from "@/app/utils/handleGraphqlError";
import { formatType } from "@/app/utils/capitalized";
import { useUserStore } from "@/hooks/useUserSession";
import toast from "react-hot-toast";

// Default initial form values
const initialForm = {
  id: "",
  firstname: "",
  middlename: "",
  lastname: "",
  suffix: "",
  gender: "",
  role: "",
  email: "",
  password: "",
  retypePassword: "",
};

type User = typeof initialForm;

const UserRegister = () => {
  // States for form, user list, modal visibility, and error handling
  const [form, setForm] = useState<User>(initialForm);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Apollo client hooks and router
  const router = useRouter();
  const [createUser] = useMutation(CREATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const { data: usersData, refetch } = useQuery(GET_ALL_USERS);

  // Fetch users from server
  useEffect(() => {
    if (usersData?.getAllUsers) {
      setUsers(usersData.getAllUsers);
    }
  }, [usersData]);

  // Handle input changes for both text and select fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate form inputs
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

  // Register new user
  const handleRegister = async () => {
    if (!isFormValid()) return;

    if (form.role !== "Cashier" && form.role !== "Manager") {
      setError("Only Cashier and Manager can register.");
      return;
    }

    const emailExists = users.some((user) => user.email === form.email);

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
          },
        },
      });

      await refetch();
      setForm(initialForm);
      setError("");
    } catch (error) {
      handleGraphQLError(error);
    }
  };

  // Reset form state
  const handleReset = () => {
    setForm(initialForm);
    setError("");
    setIsEditing(false);
  };

  // Update existing user
  const handleUpdate = async () => {
    if (!isFormValid()) return;

    try {
      await updateUser({
        variables: {
          id: selectedUser?.id,
          edits: {
            firstname: form.firstname,
            middlename: form.middlename,
            lastname: form.lastname,
            suffix: form.suffix,
            gender: form.gender.toLowerCase(),
            email: form.email,
            password: form.password,
            role: form.role.toLowerCase(),
          },
        },
      });
      await refetch();
      setForm(initialForm);
      setSelectedUser(null);
      setIsEditing(false);
      setError("");
    } catch (error) {
      handleGraphQLError(error);
    }
  };

  return (
    <SectionContainer background="min-h-screen w-full mx-auto max-w-[1280px]">
      <div className="container bg-colorDirtyWhite w-full h-[914px]">
        <div className="grid grid-cols-12 gap-4 p-4">
          {/* LEFT PANEL: User form */}
          <div className="container bg-secondaryGray w-full h-[882px] col-span-4 p-4 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              {/* Name fields */}
              {[
                { name: "firstname", label: "First Name" },
                { name: "middlename", label: "Middle Name" },
                { name: "lastname", label: "Last Name" },
                { name: "suffix", label: "Suffix", optional: true },
              ].map((field) => (
                <div key={field.name}>
                  <p className="text-primary font-semibold">
                    {field.label}{" "}
                    {!field.optional && (
                      <span className="text-colorRed">*</span>
                    )}
                  </p>
                  <input
                    name={field.name}
                    type="text"
                    required={!field.optional}
                    placeholder={`e.g ${field.label}`}
                    value={formatType(form[field.name as keyof User])}
                    onChange={handleChange}
                    className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                  />
                </div>
              ))}

              {/* Gender select */}
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

              {/* Role select */}
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

              {/* Email field */}
              <div>
                <p className="text-primary font-semibold">
                  Email <span className="text-colorRed">*</span>
                </p>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g joshua@heebrew.employee"
                  value={formatType(form.email)}
                  required
                  onChange={handleChange}
                  className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                />
              </div>

              {/* Password & Re-type */}
              {["password", "retypePassword"].map((name) => (
                <div key={name}>
                  <p className="text-primary font-semibold">
                    {name === "password" ? "Password" : "Re-type Password"}
                    <span className="text-colorRed">*</span>
                  </p>
                  <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    placeholder={
                      name === "password"
                        ? "Enter password"
                        : "Re-enter password"
                    }
                    value={form[name as keyof User]}
                    onChange={handleChange}
                    className="w-full bg-primaryGray border border-primary text-primary rounded-md p-2"
                  />
                </div>
              ))}

              {/* Show password toggle */}
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

            {/* Form action buttons */}
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
                onClick={isEditing ? handleUpdate : handleRegister}
                className="container bg-colorGreen w-full h-[42px] rounded-xl"
              >
                {isEditing ? "Update" : "Register"}
              </Button>
            </div>
          </div>

          {/* RIGHT PANEL: User table */}
          <div className="container bg-secondaryGray w-full h-[882px] col-span-8 p-4 overflow-auto">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold text-primary mb-4">
                Registered Users
              </h2>
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

            {/* User data table */}
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
                  <tr
                    key={idx}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowOverlay(true);
                    }}
                  >
                    <td className="border border-primary px-4 py-2">
                      {formatType(user.firstname)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {formatType(user.middlename)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {formatType(user.lastname)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {formatType(user.suffix)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {formatType(user.gender)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {formatType(user.role)}
                    </td>
                    <td className="border border-primary px-4 py-2">
                      {formatType(user.email)}
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

        {/* MODAL: Overlay with Close, Edit, Delete */}
        {showOverlay && selectedUser && (
          <div className="fixed inset-0 bg-primary/25 flex items-center justify-center z-50">
            <div className="bg-secondary p-6 rounded-lg shadow-lg w-[300px]">
              <p className="text-center text-tertiary font-bold mb-4">
                Select Action
              </p>
              <div className="flex justify-between gap-2">
                <Button
                  onClick={() => setShowOverlay(false)}
                  variant="universal"
                  className="text-tertiary p-4 rounded-md"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setForm(selectedUser);
                    setIsEditing(true);
                    setShowOverlay(false);
                  }}
                  variant="universal"
                  className="container text-tertiary p-4 rounded-md bg-colorGreen"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    setShowOverlay(false);
                    setShowDeleteConfirm(true);
                  }}
                  variant="universal"
                  className="container text-tertiary p-4 rounded-md bg-colorRed"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Confirm delete user */}
        {showDeleteConfirm && selectedUser && (
          <div className="fixed inset-0 bg-primary/25 flex items-center justify-center z-50">
            <div className="bg-secondary p-6 rounded-lg shadow-lg w-[300px]">
              <p className="text-center text-tertiary font-bold mb-4">
                Are you sure you want to delete this user?
              </p>
              <div className="flex justify-between gap-2">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="universal"
                  className="text-tertiary p-4 rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedUser.id) {
                      toast.success("Laoding...");
                    }

                    if (selectedUser.id) {
                      try {
                        await deleteUser({
                          variables: { id: String(selectedUser.id) },
                        });
                        await refetch();
                        setSelectedUser(null);
                        setShowDeleteConfirm(false);
                      } catch (error) {
                        handleGraphQLError(error);
                      }
                    }
                  }}
                  variant="universal"
                  className="container text-tertiary p-4 rounded-md bg-colorRed"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default UserRegister;
