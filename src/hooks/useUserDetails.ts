import { useEffect, useState } from "react";
import { AuthenticationUserDetails } from "../types/user";
import { getSecureAuth } from "../utils/SecureStore";

const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState<AuthenticationUserDetails>();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const data = await getSecureAuth();
        data.ifPresent((s) => setUserDetails(s));
      } catch (error) {
        console.log(error);
      }
    };
    getUserDetails();
  }, [])

  return [userDetails] as const;
}

export default useUserDetails