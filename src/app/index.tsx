import { View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { getSecureAuth } from "../utils/SecureStore";
import { validateToken } from "../services/UserService";
import * as SecureStore from "expo-secure-store";
import { UserRole } from "../types/enum";
import { ActivityIndicator } from "react-native-paper";

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
              router.replace('/admin');
              return;
            }
            if (userDetails.role === UserRole.MANAGER) {
              router.replace('/manager');
              return;
            }
            if (userDetails.role === UserRole.EMPLOYEE) {
              router.replace('/employee');
              return;
            }
            router.replace('/login');
          },
          () => router.replace('/login')
        );
      };
      postValidateToken();
    }, [])
  );

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator animating={true} size='large' />
    </View>
  );
}

export default App;