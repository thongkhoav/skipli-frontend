import React, { useEffect, useState } from "react";
import { ToastError, ToastSuccess } from "../../../components/Toast/Toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAxiosPrivate from "~/axios/useAxiosPrivate";
import { checkStudentNotSetupApi } from "~/apis/user.api";
import { GUEST_PATH } from "~/utils/constants";

const StudentSetup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (!searchParams.get("token")) {
      ToastError("Invalid setup link.");
      navigate(GUEST_PATH.LOGIN_ACCOUNT);
    } else {
      checkStudentNotSetupApi(searchParams.get("token")!)
        .then((res) => {
          if (!res?.data?.isNotSetup) {
            ToastError("You have already setup your account.");
            navigate(GUEST_PATH.LOGIN_ACCOUNT);
          }
        })
        .catch(() => {
          navigate(GUEST_PATH.LOGIN_ACCOUNT);
        });
    }
  }, []);

  const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Remove spaces from username
    setUsername(event.target.value.replace(/\s/g, ""));
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
    if (password.length < 6) {
      ToastError("Password must be at least 6 characters long.");
      return;
    }
    try {
      await axiosPrivate.post(`/setupAccount`, {
        token: searchParams.get("token"),
        username,
        password,
      });
      ToastSuccess("Account setup successful!");
      navigate(GUEST_PATH.LOGIN_ACCOUNT);
    } catch (error: any) {
      ToastError(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg flex flex-col items-center shadow-box">
        <h1 className="text-2xl font-bold mb-8">Setup Student Account</h1>
        <form onSubmit={formSubmit} className="w-full">
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
            <label className="block font-semibold">Password</label>
            <span className="text-sm">
              Password must be at least 6 characters long.
            </span>
            <input
              onChange={onChangePassword}
              value={password}
              minLength={6}
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
