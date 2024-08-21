import { View, Text, Pressable, TextInput } from "react-native";
import { useCallback, useState } from "react";
import { UserAuthentication } from "../types/user";
import { authenticateUser } from "../services/UserService";
import { useMutation } from "@tanstack/react-query";
import { getSecureItem, saveSecureAuth, setSecureItem } from "../utils/SecureStore";
import { router, useFocusEffect } from "expo-router";
import Checkbox from "expo-checkbox";
import { UserRole } from "../types/enum";

const LoginPage = () => {
  const [userAuth, setUserAuth] = useState<UserAuthentication>({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const getRememberMe = async () => {
        const item = await getSecureItem("remember-me");
        item.ifPresentOrElse(
          (s) => {
            setRememberMe(s == "true");
          },
          () => setRememberMe(true) 
        );
      };
      getRememberMe();
    }, [])
  );

  const { isPending, isError, error, mutate } = useMutation({
    mutationFn: () => authenticateUser(userAuth),
    onSuccess: async ({ data }) => {
      await saveSecureAuth({
        ...data,
      });
      await setSecureItem("remember-me", rememberMe.toString());
      if (data.role === UserRole.ADMIN) {
        router.push("/admin");
      }
    },
  });

  if (isError) {
    console.log(error);
  }

  const handleClick = () => {
    if (!isPending) {
      mutate();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex flex-col justify-center mx-10">
        <Text className="self-center mt-48 mb-2 text-2xl text-center text-black">
          FMPT-App
        </Text>
        <View className="flex flex-col p-2.5 mt-2.5 bg-gray-100 rounded tracking-wider">
          <Text className="text-xs text-blue-600">USERNAME</Text>
          <TextInput
            className="pt-1 text-base text-black"
            onChangeText={(text) =>
              setUserAuth({ ...userAuth, username: text })
            }
            value={userAuth.username}
          />
        </View>
        <View className="flex flex-col p-2.5 mt-2.5 bg-gray-100 rounded tracking-wider">
          <Text className="text-xs text-blue-600">PASSWORD</Text>
          <TextInput
            className="pt-1 text-base text-black"
            onChangeText={(text) =>
              setUserAuth({ ...userAuth, password: text })
            }
            value={userAuth.password}
            secureTextEntry
          />
        </View>
        <View className="flex flex-row items-center mt-2.5 text-black">
          <Checkbox
            className="shrink-0 ml-1 mr-2"
            value={rememberMe}
            onValueChange={setRememberMe}
          />
          <Text>Keep Me Log In</Text>
        </View>
        <Pressable
          className="flex flex-row justify-center p-2.5 mt-5 bg-green-400 rounded"
          onPress={handleClick}
        >
          <Text className="text-base font-semibold text-white tracking-wider">
            {isPending ? "Loading..." : "LOGIN"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginPage;
