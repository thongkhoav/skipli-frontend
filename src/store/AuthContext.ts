import { createContext } from "react";
import { LoginUser } from "~/apis/user.api";

export interface IAuthContext {
  token: string;
  onLogin: (phone: string, accessCode: string, email: string) => void;
  onLogout: () => void;
  userGlobal: LoginUser;
  setUserGlobal: React.Dispatch<any>;
}

export enum UserRole {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
}
export const AuthContext = createContext<IAuthContext>({
  token: "",
  userGlobal: {
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    username: "",
    role: "instructor" as UserRole,
    accessToken: "",
    refreshToken: "",
  },
  setUserGlobal: () => {},
  onLogin: (phone: string, accessCode: string, email: string) => {},
  onLogout: () => {},
});
