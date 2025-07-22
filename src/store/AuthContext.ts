import { createContext } from "react";
import { UserProfile } from "~/utils/types/user.type";

export interface IAuthContext {
  token: string;
  onLogin: (phone: string, accessCode: string, email: string) => void;
  onLoginByAccount: (email: string, password: string) => void;
  onLogout: () => void;
  userGlobal: UserProfile | null;
  setUserGlobal: React.Dispatch<any>;
}

export enum UserRole {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
}
export const AuthContext = createContext<IAuthContext>({
  token: "",
  userGlobal: {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "instructor" as UserRole,
    accessToken: "",
    refreshToken: "",
  },
  setUserGlobal: () => {},
  onLogin: () => {},
  onLoginByAccount: () => {},
  onLogout: () => {},
});
