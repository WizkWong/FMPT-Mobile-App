import * as SecureStore from "expo-secure-store";
import { useQuery } from "@tanstack/react-query";
import { UserAuth } from "../types/user";
import { authenticateUser } from "../services/UserService";
import { useEffect } from "react";

const useLogin = (userAuth: UserAuth) => {
  const { data, isLoading, error} = useQuery({
    queryKey: ["authenticateUser"],
    queryFn: () => authenticateUser(userAuth),
  });

  useEffect(() => {
    if (data && data.token) {
      console.log(data); // Log the entire response data
      console.log(data.token); // Specifically log the token
      SecureStore.setItemAsync("token", data.token);
    }
  }, [data]);
};

export default useLogin;
