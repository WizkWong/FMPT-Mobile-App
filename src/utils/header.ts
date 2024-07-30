import { getSecureAuth } from "./SecureStore";

export async function setAuthorizationHeader() {
  const userDetails = await getSecureAuth();
  if (userDetails.isEmpty()) {
    throw "Authorization Token does not exist!";
  }
  return {
    headers: {
      Authorization: `Bearer ${userDetails.get().token}`,
    },
  };
}
