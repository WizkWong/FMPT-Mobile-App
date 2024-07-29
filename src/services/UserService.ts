import axios from "axios";
import { UserAuthentication, AuthenticationUserDetails } from "../types/user";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 5000,
});

type AuthenticationUserDetailsRoleAsStr = Omit<AuthenticationUserDetails, 'role'> & { role: string };

export const authenticateUser = async (userAuth: UserAuthentication): Promise<AuthenticationUserDetailsRoleAsStr> => {
  const res = await api.post('/auth/authenticate', userAuth);
  return res.data;
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
