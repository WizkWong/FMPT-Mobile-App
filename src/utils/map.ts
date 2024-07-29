import { UserRole } from "../types/enum";

export const stringToUserRole = (role: string): UserRole => {
  switch (role) {
    case "MANAGER":
      return UserRole.MANAGER;
    case "ADMIN":
      return UserRole.ADMIN;
    default:
      return UserRole.EMPLOYEE;
  }
};
