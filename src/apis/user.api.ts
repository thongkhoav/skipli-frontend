import axios, { AxiosResponse } from "axios";
import { UserRole } from "~/store/AuthContext";
import { HOST } from "~/utils/constants";

export interface LoginUser {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  username?: string;
  phone?: string;
  accessToken: string;
  refreshToken: string;
}

interface AccessTokenRes extends AxiosResponse {
  data: {
    accessToken: string;
  };
}

export interface ReqLogin {
  phone?: string;
  email?: string;
  code: string;
}

export const validateAccessCodeApi = async (
  body: ReqLogin
): Promise<{ data: LoginUser }> =>
  await axios.post(`${HOST}/api/v1/users/login`, body);

// export const logoutApi = async (accessToken: string, refreshToken: string) => {
//   const data = {
//     refreshToken,
//   };

//   return await axios.post(`${HOST}/api/v1/users/logout`, data, {
//     withCredentials: true,
//   });
// };

export const getAccessTokenApi = async (
  refreshToken: string
): Promise<AccessTokenRes> =>
  await axios.post(`${HOST}/api/v1/users/refresh-token`, {
    refreshToken,
  });

export const loginGoogleApi = async () => {
  const res = await axios.get(`${HOST}/api/auth/google/success`, {
    withCredentials: true,
  });
  return res;
};

export const deleteUserApiPath = (id: string) => `${HOST}/api/v1/users/${id}`;
