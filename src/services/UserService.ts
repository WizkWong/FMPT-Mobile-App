import axios, { AxiosResponse } from "axios";
import { UserAuthentication, AuthenticationUserDetails, User } from "../types/user";
import { setAuthorizationHeader } from "../utils/header";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 5000,
});

type AuthenticationUserDetailsRoleAsStr = Omit<AuthenticationUserDetails, 'role'> & { role: string };

export const authenticateUser = async (userAuth: UserAuthentication): Promise<AxiosResponse<AuthenticationUserDetailsRoleAsStr, any>> => {
  return await api.post('/auth/authenticate', userAuth);
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

export const createUser = async (user: User): Promise<AxiosResponse<any, any>> => {
  return await api.post('/users', user, await setAuthorizationHeader());
}