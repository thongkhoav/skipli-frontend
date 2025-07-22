import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, IAuthContext } from "./AuthContext";
import {
  clearUserData,
  getAccessToken,
  getUserData,
  setUserData,
} from "~/utils/helpers/auth";
import { USER_PATH, GUEST_PATH, getBaseUrl } from "~/utils/constants";
import { toast } from "react-toastify";
import { loginByAccountApi, validateAccessCodeApi } from "../apis/user.api";
import { UserRole } from "~/store/AuthContext";
import { ToastSuccess } from "~/components/Toast/Toast";
import useAxiosPrivate from "~/axios/useAxiosPrivate";
import { UserProfile } from "~/utils/types/user.type";
import axios from "axios";

function AuthProvider({ children }: any) {
  const localAccessToken = getAccessToken() || null;
  const [userGlobal, setUserGlobal] = useState<UserProfile | null>();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = useCallback(async () => {
    const userData = getUserData();
    console.log({
      type: "before getProfile",
      userData,
      localAccessToken,
    });
    if (userData && userData?.accessToken && userData?.refreshToken) {
      const getProfileResponse = await axiosPrivate.get("/getProfile");
      console.log({
        type: "after getProfile",
        getProfileResponse,
      });
      setUserGlobal({
        ...getProfileResponse.data,
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      });
    }
  }, [axiosPrivate]);

  const fetProfileAfterLogin = useCallback(
    async (accessToken: string, refreshToken: string) => {
      console.log({
        type: "before getProfile",
        accessToken,
        refreshToken,
      });
      const getProfileResponse = await axios.get(getBaseUrl() + "/getProfile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      console.log({
        type: "after getProfile",
        getProfileResponse,
      });
      setUserGlobal({
        ...getProfileResponse.data,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    },
    []
  );

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
        data: response.data,
      });
      setUserData(response.data);
      await fetProfileAfterLogin(
        response.data.accessToken,
        response.data.refreshToken
      );

      if (userGlobal?.role === UserRole.INSTRUCTOR) {
        navigate(USER_PATH.STUDENTS);
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
      await fetProfileAfterLogin(
        response.data.accessToken,
        response.data.refreshToken
      );

      if (userGlobal?.role === UserRole.STUDENT) {
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
