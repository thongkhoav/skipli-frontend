import { UserRole } from "~/store/AuthContext";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  accessToken?: string;
  refreshToken?: string;
}
