import React, { useState } from "react";
import { ToastError, ToastSuccess } from "../../../components/Toast/Toast";
import { GUEST_PATH } from "~/utils/constants";
import { useNavigate } from "react-router-dom";
import { createInstructorApi } from "~/apis/user.api";
import { LuAsterisk } from "react-icons/lu";

const CreateInstructor = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !phone || !email) {
      ToastError("Name, phone, and email are required.");
      return;
    }
    try {
      await createInstructorApi({
        name,
        phone,
        email,
      });
      ToastSuccess("Instructor created successfully.");
      navigate(GUEST_PATH.LOGIN_PHONE);
    } catch (error: any) {
      ToastError(
        error?.response?.data?.message || "Failed to create instructor."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg flex flex-col items-center shadow-box">
        <h1 className="text-2xl font-bold mb-8">Create Instructor</h1>
        <form onSubmit={formSubmit} className="w-60">
          <div className="mb-4">
            <label className=" mb-2 font-semibold shad flex items-center">
              Name <LuAsterisk color="red" />
            </label>
            <input
              onChange={onChangeName}
              value={name}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className=" mb-2 font-semibold shad flex items-center">
              Phone <LuAsterisk color="red" />
            </label>
            <input
              onChange={onChangePhone}
              value={phone}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className=" mb-2 font-semibold shad flex items-center">
              Email <LuAsterisk color="red" />
            </label>
            <input
              onChange={onChangeEmail}
              value={email}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
              type="email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 mb-4 "
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInstructor;
