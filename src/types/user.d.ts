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

export interface User {
  id?: number;
  username?: string;
  phoneNo?: string;
  image?: string;
  role?: UserRole;
  department?: string;
  createdDateTime?: string;
}

export interface Department {
  id: number;
  name: string;
  totalEmployee?: number;
}
