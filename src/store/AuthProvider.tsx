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
import { validateAccessCodeApi } from "../apis/user.api";
import { UserRole } from "~/store/AuthContext";

function AuthProvider({ children }: any) {
  const localAccessToken = getAccessToken() || null;
  const [userGlobal, setUserGlobal] = useState(getUserData());
  const navigate = useNavigate();

  useEffect(() => {
    // setUserData(userGlobal === null ? {} : userGlobal);
    if (userGlobal != null) {
      // if (userGlobal?.role === Role.ADM) {
      //   navigate("/admin");
      // }
    }
  }, [userGlobal]);

  const handleValidateCode = async (phone: string, code: string) => {
    try {
      const user = await validateAccessCodeApi({
        phone,
        code,
      });
      setUserData(user.data);
      setUserGlobal(user.data);

      if (user.data.role === UserRole.INSTRUCTOR) {
        navigate(USER_PATH.STUDENTS);
        return;
      } else if (user.data.role === UserRole.STUDENT) {
        navigate(USER_PATH.LESSONS);
        return;
      }
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
    }),
    [localAccessToken, userGlobal]
  ) as IAuthContext;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
