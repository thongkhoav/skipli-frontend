import React, { useEffect, useState } from "react";
import { useAuth } from "~/utils/helpers";
import { ToastError, ToastSuccess } from "../../../components/Toast/Toast";
import { requestCodeForPhoneApi } from "~/apis/user.api";
import { Link, useNavigate } from "react-router-dom";
import { GUEST_PATH, USER_PATH } from "~/utils/constants";
import { UserRole } from "~/store/AuthContext";
import USA from "~/assets/usa-icon.png";

const LoginPhone = () => {
  const [phone, setPhone] = useState("");
  const { onLogin } = useAuth();
  const [codeSent, setCodeSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
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

  const onChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure phone number is numeric and has no spaces
    const value = event.target.value.replace(/\D/g, "");
    setPhone(value);
  };

  const onChangeOtpCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "");
    setOtpCode(value);
  };

  const requestFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await requestCodeForPhoneApi(`+1${phone}`);
      setCodeSent(true);
      ToastSuccess("Code sent to your phone. Please check your messages.");
      setOtpCode("");
    } catch (error: any) {
      ToastError(error?.response?.data?.message || "Failed to send code.");
    }
  };
  const verificationFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (otpCode.length !== 6 || isNaN(Number(otpCode))) {
      ToastError("OTP code must be 6 digits.");
      return;
    }
    onLogin(`+1${phone}`, otpCode, "");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!codeSent ? (
        <div className=" max-w-lg w-full bg-white p-6 rounded-lg flex flex-col items-center shadow-lg shadow-box">
          <h1 className="text-2xl font-bold mb-8">Instructor Login</h1>

          <form onSubmit={requestFormSubmit} className="w-100">
            <div className="mb-4">
              <label className="block font-semibold shad">Phone</label>
              <span className="text-sm">Only US phone available</span>
              <div className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 flex items-center gap-4">
                <div className="text-gray-500 flex gap-2 font-semibold items-center border p-2 border-gray-300 rounded bg-gray-200">
                  <img src={USA} alt="" className="w-6 h-6" />
                  <div>+1</div>
                </div>
                <input
                  value={phone}
                  max={10}
                  onChange={onChangePhone}
                  placeholder="2125551212"
                  className=" py-2 focus:outline-none "
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 mb-4 hover:cursor-pointer"
            >
              Send OTP
            </button>
          </form>
          <Link
            to={GUEST_PATH.CREATE_INSTRUCTOR}
            className="text-indigo-500 hover:underline"
          >
            Instructor Signup
          </Link>
          <Link
            to={GUEST_PATH.LOGIN_ACCOUNT}
            className="text-indigo-500 hover:underline"
          >
            Student Login
          </Link>
        </div>
      ) : (
        <div className="max-w-md w-full bg-white p-6 rounded-lg flex flex-col items-center shadow-lg shadow-box">
          <h1 className="text-2xl font-bold mb-8">Enter OTP</h1>
          <form onSubmit={verificationFormSubmit} className="w-100">
            <div className="mb-4">
              <label className="block mb-2 font-semibold shad">OTP Code</label>
              <span className="text-sm">
                Please check your phone messages for the OTP code.
              </span>
              <input
                type="text"
                value={otpCode}
                min={6}
                max={6}
                onChange={onChangeOtpCode}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 mb-4 hover:cursor-pointer"
            >
              Verify
            </button>
          </form>
          <span
            onClick={() => setCodeSent(false)}
            className="text-blue-500 hover:underline"
          >
            Back
          </span>
        </div>
      )}
    </div>
  );
};

export default LoginPhone;
