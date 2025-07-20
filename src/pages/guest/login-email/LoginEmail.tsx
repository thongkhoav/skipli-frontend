import React, { useState } from "react";
import { useAuth } from "~/utils/helpers";
import { ToastError } from "../../../components/Toast/Toast";

const LoginEmail = () => {
  const [email, setEmail] = useState("");
  const { onLogin } = useAuth();

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // await onLogin(phone);
    } catch (error: any) {
      ToastError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
        className={` max-w-md w-full bg-white p-6 rounded-lg flex flex-col items-center shadow-box`}
      >
        <h1 className="text-2xl font-bold mb-8">Login by Email</h1>
        <form onSubmit={formSubmit} className="w-60">
          <div className="mb-4">
            <label className="block mb-2 font-semibold shad">Email</label>
            <input
              onChange={onChangeEmail}
              value={email}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 mb-4 hover:cursor-pointer"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginEmail;
