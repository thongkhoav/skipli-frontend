import React, { useState } from "react";
import { ToastError } from "../../../components/Toast/Toast";

const StudentSetup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username || !password) {
      ToastError("Username and password are required.");
      return;
    }
    try {
    } catch (error: any) {
      ToastError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg flex flex-col items-center shadow-box">
        <h1 className="text-2xl font-bold mb-8">Setup Student Account</h1>
        <form onSubmit={formSubmit} className="w-60">
          <div className="mb-4">
            <label className="block mb-2 font-semibold shad">Username</label>
            <input
              onChange={onChangeUsername}
              value={username}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Password</label>
            <input
              onChange={onChangePassword}
              value={password}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
              type="password"
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

export default StudentSetup;
