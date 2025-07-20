import axios, { AxiosResponse } from "axios";
import { UserRole } from "~/store/AuthContext";
import { HOST } from "~/utils/constants";

export interface LoginUser {
  _id: string;
  name: string;
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
  phoneNumber?: string;
  email?: string;
  accessCode: string;
}

export interface ReqLoginByAccount {
  email: string;
  password: string;
}

export const validateAccessCodeApi = async (
  body: ReqLogin
): Promise<{ data: LoginUser }> =>
  await axios.post(`${HOST}/validateAccessCode`, body);

export const loginByAccountApi = async (
  body: ReqLoginByAccount
): Promise<{ data: LoginUser }> =>
  await axios.post(`${HOST}/loginByAccount`, body);

export const requestCodeForPhoneApi = async (
  phoneNumber: string
): Promise<void> =>
  await axios.post(`${HOST}/createAccessCode`, { phoneNumber });

export const requestCodeForMailApi = async (email: string): Promise<void> =>
  await axios.post(`${HOST}/loginEmail`, { email });

export const checkStudentNotSetupApi = async (token: string) =>
  await axios.post(`${HOST}/checkStudentNotSetup`, { token });

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
