import { UserRole } from "./enum";

export interface UserAuthentication {
  username: string;
  password: string;
}

export interface AuthenticationUserDetails {
  userId: number;
  username: string;
  role: UserRole;
  token: string;
}
