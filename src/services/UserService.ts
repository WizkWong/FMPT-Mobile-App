import axios, { AxiosResponse } from "axios";
import { UserAuthentication, AuthenticationUserDetails, User } from "../types/user";
import { setAuthorizationHeader } from "../utils/header";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 5000,
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

export const getAllUsers = async (): Promise<AxiosResponse<User[], any>> => {
  console.log("fetch all users")
  return api.get('/users', await setAuthorizationHeader());
}

export const getUserById = async (id: number): Promise<AxiosResponse<User, any>> => {
  console.log("fetch user " + id)
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