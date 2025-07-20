import React, { useState } from "react";
import { useAuth } from "~/utils/helpers";
import { ToastError, ToastSuccess } from "../../../components/Toast/Toast";
import { requestCodeForPhoneApi } from "~/apis/user.api";

const LoginPhone = () => {
  const [phone, setPhone] = useState("");
  const { onLogin } = useAuth();
  const [codeSent, setCodeSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const onChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const onChangeOtpCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtpCode(event.target.value);
  };

  const requestFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await requestCodeForPhoneApi(phone);
      setCodeSent(true);
      ToastSuccess("Code sent to your phone. Please check your messages.");
    } catch (error: any) {
      ToastError(error.message);
    }
  };
  const verificationFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    onLogin(phone, otpCode, "");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!codeSent ? (
        <div className=" max-w-md w-full bg-white p-6 rounded-lg flex flex-col items-center shadow-lg shadow-box">
          <h1 className="text-2xl font-bold mb-8">Login by Phone</h1>

          <form onSubmit={requestFormSubmit} className="w-60">
            <div className="mb-4">
              <label className="block mb-2 font-semibold shad">Phone</label>
              <input
                value={phone}
                onChange={onChangePhone}
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
      ) : (
        <div className="max-w-md w-full bg-white p-6 rounded-lg flex flex-col items-center shadow-lg shadow-box">
          <h1 className="text-2xl font-bold mb-8">Enter OTP</h1>
          <form onSubmit={verificationFormSubmit} className="w-60">
            <div className="mb-4">
              <label className="block mb-2 font-semibold shad">OTP Code</label>
              <input
                type="text"
                value={otpCode}
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
        </div>
      )}
    </div>
  );
};

export default LoginPhone;
