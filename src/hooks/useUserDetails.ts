import { useEffect, useState } from "react";
import { AuthenticationUserDetails } from "../types/user";
import { getSecureAuth, saveSecureAuth } from "../utils/SecureStore";
import { getLatestProfile } from "../services/UserService";
import { useMutation } from "@tanstack/react-query";

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

  const { mutate } = useMutation({
    mutationFn: () => getLatestProfile(userDetails),
    onSuccess: async ({ data }) => {
      await saveSecureAuth({
        ...data,
      });
      setUserDetails({...data});
    },
  });

  const refreshUserDetails = () => mutate();

  return [userDetails, refreshUserDetails] as const;
}

export default useUserDetails