import * as SecureStore from "expo-secure-store";
import { Optional } from "typescript-optional";
import { AuthenticationUserDetails } from "../types/user";

export const setSecureItem = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const getSecureItem = async (key: string): Promise<Optional<string>> => {
  try {
    const result = await SecureStore.getItemAsync(key);
    if (result) {
      return Optional.of(result);
    }
  } catch (error) {
    console.error("Error getting secure value:", error);
  }
  return Optional.empty();
};

export const saveSecureAuth = async (value: AuthenticationUserDetails) => {
  await setSecureItem("auth", JSON.stringify(value));
};

export const getSecureAuth = async (): Promise<Optional<AuthenticationUserDetails>> => {
  const authItem = await getSecureItem("auth");
  return authItem.map<AuthenticationUserDetails>((s) => JSON.parse(s));
};


