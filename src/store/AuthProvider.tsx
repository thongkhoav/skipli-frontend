import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, IAuthContext } from "./AuthContext";
import {
  clearUserData,
  getAccessToken,
  getUserData,
  setUserData,
} from "~/utils/helpers/auth";
import { USER_PATH, GUEST_PATH } from "~/utils/constants";
import { toast } from "react-toastify";
import { loginByAccountApi, validateAccessCodeApi } from "../apis/user.api";
import { UserRole } from "~/store/AuthContext";
import { ToastSuccess } from "~/components/Toast/Toast";

function AuthProvider({ children }: any) {
  const localAccessToken = getAccessToken() || null;
  const [userGlobal, setUserGlobal] = useState(getUserData());
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthProvider userGlobal:", userGlobal);
    setUserData(userGlobal === null ? {} : userGlobal);
    if (userGlobal != null) {
      if (userGlobal?.role === UserRole.INSTRUCTOR) {
        navigate(USER_PATH.STUDENTS);
      } else if (userGlobal?.role === UserRole.STUDENT) {
        navigate(USER_PATH.LESSONS);
      }
    }
  }, []);

  const handleValidateCode = async (
    phoneNumber: string,
    accessCode: string,
    email: string
  ) => {
    try {
      const response = await validateAccessCodeApi({
        phoneNumber,
        accessCode,
        email,
      });
      console.log({
        type: "after validateAccessCodeApi",
        response,
      });
      setUserData(response.data);
      setUserGlobal(response.data);

      if (response.data.role === UserRole.INSTRUCTOR) {
        navigate(USER_PATH.STUDENTS);
        return;
      } else if (response.data.role === UserRole.STUDENT) {
        navigate(USER_PATH.LESSONS);
        return;
      }
      ToastSuccess("Login successful!");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleLoginByAccount = async (username: string, password: string) => {
    try {
      const response = await loginByAccountApi({
        password,
        username,
      });
      console.log({
        type: "after validateAccessCodeApi",
        response,
      });
      setUserData(response.data);
      setUserGlobal(response.data);

      if (response.data.role === UserRole.INSTRUCTOR) {
        navigate(USER_PATH.STUDENTS);
        return;
      } else if (response.data.role === UserRole.STUDENT) {
        navigate(USER_PATH.LESSONS);
        return;
      }
      ToastSuccess("Login successful!");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleLogout = async () => {
    try {
      clearUserData();
      setUserGlobal(null);
      navigate(GUEST_PATH.LOGIN_PHONE);
    } catch (error: any) {
      console.log(error);
    }
  };

  const value = useMemo(
    () => ({
      token: localAccessToken,
      userGlobal,
      setUserGlobal,
      onLogin: handleValidateCode,
      onLogout: handleLogout,
      onLoginByAccount: handleLoginByAccount,
    }),
    [localAccessToken, userGlobal]
  ) as IAuthContext;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
