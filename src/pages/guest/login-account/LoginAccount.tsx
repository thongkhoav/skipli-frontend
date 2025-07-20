import React, { useEffect, useState } from "react";
import { useAuth } from "~/utils/helpers";
import { ToastError } from "../../../components/Toast/Toast";
import { Link, useNavigate } from "react-router-dom";
import { GUEST_PATH, USER_PATH } from "~/utils/constants";
import { UserRole } from "~/store/AuthContext";

const LoginAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLoginByAccount } = useAuth();
  const { userGlobal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userGlobal) {
      navigate(
        userGlobal.role === UserRole.INSTRUCTOR
          ? USER_PATH.STUDENTS
          : USER_PATH.LESSONS
      );
    }
  }, [navigate, userGlobal]);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!password && !email) {
        ToastError("Email and password are required.");
        return;
      }
      onLoginByAccount(email, password);
    } catch (error: any) {
      ToastError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg flex flex-col items-center shadow-box">
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

          <div className="mb-4">
            <label className="block mb-2 font-semibold shad">Password</label>
            <input
              type="password"
              onChange={onChangePassword}
              value={password}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 mb-4 hover:cursor-pointer"
          >
            Login
          </button>
        </form>
        <Link
          to={GUEST_PATH.LOGIN_EMAIL}
          className="text-indigo-500 hover:underline"
        >
          Login by Email
        </Link>
      </div>
    </div>
  );
};

export default LoginAccount;
