import { Pressable, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { getSecureAuth } from "../utils/SecureStore";
import { validateToken } from "../services/UserService";
import * as SecureStore from "expo-secure-store";
import { UserRole } from "../types/enum";

const App = () => {

  useFocusEffect(
    useCallback(() => {
      const postValidateToken = async () => {
        const userDetailsOptional = await getSecureAuth();
        userDetailsOptional.ifPresentOrElse(
          async (userDetails) => {
            const isStatusOK = await validateToken(userDetails);
            if (!isStatusOK) {
              await SecureStore.deleteItemAsync('auth');
              router.replace('/login');
              return;
            }
            if (userDetails.role === UserRole.ADMIN) {
              router.replace('/admin/home');
              return;
            }
          },
          () => router.replace('/login')
        );
      };
      postValidateToken();
    }, [])
  );

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Pressable className="p-4 border-b-2" onPress={() => router.push("/login")}></Pressable>
    </View>
  );
}

export default App;