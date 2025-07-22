import axios from "./axios";
import { clearUserData, useAuth } from "~/utils/helpers";
import { setUserData, getUserData } from "~/utils/helpers";
import { useNavigate } from "react-router-dom";
import { GUEST_PATH } from "~/utils/constants";

const useRefreshToken = () => {
  const { setUserGlobal } = useAuth();
  const user = getUserData();
  const navigate = useNavigate();

  const refresh = async () => {
    try {
      const response = await axios.post("/refreshToken", {
        refreshToken: user?.refreshToken || "",
      });
      setUserData({
        ...user,
        accessToken: response?.data?.accessToken,
        refreshToken: response?.data?.refreshToken,
      });
      setUserGlobal((prev: any) => ({
        ...prev,
        accessToken: response?.data?.accessToken,
        refreshToken: response?.data?.refreshToken,
      }));
      return response.data.accessToken;
    } catch (error) {
      console.error("Failed to refresh token", error);
      clearUserData();
      setUserGlobal(null);
      navigate(GUEST_PATH.LOGIN_PHONE);
    }
  };

  return refresh;
};

export default useRefreshToken;
