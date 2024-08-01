import { getSecureAuth } from "./SecureStore";

export const setAuthorizationHeader = async () => {
  const userDetails = await getSecureAuth();
  if (userDetails.isEmpty()) {
    throw Error("Authorization Token does not exist!");
  }
  return {
    headers: {
      Authorization: `Bearer ${userDetails.get().token}`,
    },
  };
}
