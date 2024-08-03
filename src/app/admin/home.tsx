import { useEffect } from "react";
import { View, Text, Alert, BackHandler, Pressable } from "react-native";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";

const HomePage = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert(
          "Exit App",
          "Do you want to exit?",
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            { text: "YES", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );

        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  const logOut = async () => {
    queryClient.removeQueries();
    await SecureStore.deleteItemAsync('auth');
    router.replace('/login');
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Home Page</Text>
      <Link className="p-4 border-2" push href="/users/list">
        View Customer
      </Link>
      <Link className="p-4 border-2" push href="/users/create">
        Create Customer
      </Link>
      <Pressable className="p-4 border-2" onPress={() => logOut()}>
        <Text>
          Logout
        </Text>
      </Pressable>
    </View>
  );
};

export default HomePage;
