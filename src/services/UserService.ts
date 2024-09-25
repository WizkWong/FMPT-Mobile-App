import axios, { AxiosResponse } from "axios";
import { UserAuthentication, AuthenticationUserDetails, User, Department, UserPage, EmployeePage } from "../types/user";
import { setAuthorizationHeader } from "../utils/header";
import { UserRole } from "../types/enum";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export const authenticateUser = (userAuth: UserAuthentication): Promise<AxiosResponse<AuthenticationUserDetails, any>> => {
  return api.post('/auth/authenticate', userAuth);
}

export const validateToken = async (userDetails: AuthenticationUserDetails): Promise<boolean> => {
  try {
    const { status } = await api.post(`/auth/validate-token`, {
      username: userDetails.username,
      token: userDetails.token,
    });
    return status === 200;
  } catch (error) {
    console.log(error);
  }
  return false;
};

export const getLatestProfile = async (userDetails: AuthenticationUserDetails): Promise<AxiosResponse<AuthenticationUserDetails, any>> => {
  return await api.post(`/auth/profile`, {
    username: userDetails.username,
    token: userDetails.token,
  });
};

export const getProfileImage = async (userDetails: AuthenticationUserDetails): Promise<AxiosResponse<string, any>> => {
  return await api.post(`/auth/profile-image`, {
    username: userDetails.username,
    token: userDetails.token,
  });
};

export const getUserByFilter = async (page: number, search: string, department: string = "", role: UserRole = undefined): Promise<AxiosResponse<UserPage, any>> => {
  return api.get(`/users?page=${page}&search=${search}&department=${department}&role=${role}`, await setAuthorizationHeader());
}

export const getEmployeeByFilter = async (page: number, search: string, department: string = ""): Promise<AxiosResponse<EmployeePage, any>> => {
  return api.get(`/users/employees?page=${page}&search=${search}&department=${department}`, await setAuthorizationHeader());
}

export const getUserById = async (id: number): Promise<AxiosResponse<User, any>> => {
  return api.get(`/users/${id}`, await setAuthorizationHeader());
}

export const createUser = async (user: User): Promise<AxiosResponse<any, any>> => {
  return api.post('/users', user, await setAuthorizationHeader());
}

export const updateUser = async (user: User): Promise<AxiosResponse<any, any>> => {
  return api.put('/users', user, await setAuthorizationHeader());
}

export const deleteUser = async (id: number): Promise<AxiosResponse<any, any>> => {
  return api.delete(`/users/${id}`, await setAuthorizationHeader());
}

export const resetUserPassword = async (id: number): Promise<AxiosResponse<any, any>> => {
  return api.post(`/users/${id}`, null, await setAuthorizationHeader());
}

export const getAllDepartments = async (): Promise<AxiosResponse<Department[], any>> => {
  return api.get('/departments', await setAuthorizationHeader());
}

export const createDepartment = async (departmentName: string): Promise<AxiosResponse<any, any>> => {
  return api.post(`/departments?department=${departmentName}`, null, await setAuthorizationHeader());
}

export const updateDepartment = async (department: Department): Promise<AxiosResponse<any, any>> => {
  return api.put('/departments', department, await setAuthorizationHeader());
}

export const deleteDepartment = async (id: number): Promise<AxiosResponse<any, any>> => {
  return api.delete(`/departments/${id}`, await setAuthorizationHeader());
}