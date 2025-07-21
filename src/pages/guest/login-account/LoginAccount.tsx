import React, { useEffect, useState } from "react";
import { useAuth } from "~/utils/helpers";
import { ToastError } from "../../../components/Toast/Toast";
import { Link, useNavigate } from "react-router-dom";
import { GUEST_PATH, USER_PATH } from "~/utils/constants";
import { UserRole } from "~/store/AuthContext";

const LoginAccount = () => {
  const [username, setUsername] = useState("");
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

  const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!password && !username) {
        ToastError("Username and password are required.");
        return;
      }
      if (password.length < 6) {
        ToastError("Password must be at least 6 characters long.");
        return;
      }
      onLoginByAccount(username, password);
    } catch (error: any) {
      ToastError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg flex flex-col items-center shadow-box">
        <h1 className="text-2xl font-bold mb-8">Student Login</h1>
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
          Instructor Login
        </Link>
      </div>
    </div>
  );
};

export default LoginAccount;
