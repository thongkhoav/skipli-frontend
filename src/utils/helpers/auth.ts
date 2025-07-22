import { useContext } from "react";
import { LoginUser } from "~/apis/user.api";
import { AuthContext } from "~/store/AuthContext";

// export type TUser = {
//   accessToken: string;
//   refreshToken: string;
// };

export const useAuth = () => useContext(AuthContext);

export const getUserData = (): Partial<LoginUser> | null => {
  let user;
  if (typeof Storage === "undefined") {
    user = {};
  }
  user = JSON.parse(localStorage.getItem("user") || "{}");
  if (Object.keys(user).length === 0) {
    return null;
  }
  return user;
};

export const setUserData = (user: Partial<LoginUser>) => {
  if (!user || typeof user !== "object") {
    throw new Error("No valid data found");
  }
  console.log("setUserData", user);
  localStorage.setItem("user", JSON.stringify(user));
};

export function clearUserData(): void {
  if (typeof Storage === "undefined") return;
  localStorage.removeItem("user");
}

export const getAccessToken = () => {
  if (typeof Storage === "undefined") {
    return new Error("Storage type not valid");
  }
  return JSON.parse(localStorage.getItem("user") || "{}")?.accessToken;
};
