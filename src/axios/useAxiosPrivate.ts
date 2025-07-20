import { axiosBase } from "./axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { clearUserData, getUserData } from "~/utils/helpers";
import { useNavigate } from "react-router-dom";
import { GUEST_PATH } from "~/utils/constants";

const useAxiosPrivate = () => {
  // const refresh = useRefreshToken();
  const user = getUserData();
  const navigate = useNavigate();

  useEffect(() => {
    const requestIntercept = axiosBase.interceptors.request.use(
      (config: any) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user?.accessToken}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // if access token is expired, response will throw back, use refresh token to get new access token
    const responseIntercept = axiosBase.interceptors.response.use(
      (response: any) => response,
      async (error: { config: any; response: { status: number } }) => {
        const prevRequest = error?.config;
        // 500 expire
        // 401 user no longer exist
        if (
          (error?.response?.status === 500 ||
            error?.response?.status === 401) &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;

          // const newAccessToken = await refresh();
          // prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          // clearUserData();
          // // setUserGlobal(null);
          // navigate(GUEST_PATH.LOGIN_PHONE);
          // // refresh page
          // window.location.reload();
          return axiosBase(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosBase.interceptors.request.eject(requestIntercept);
      axiosBase.interceptors.response.eject(responseIntercept);
    };
  }, [user]);

  return axiosBase;
};

export default useAxiosPrivate;
