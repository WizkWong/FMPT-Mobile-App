import { useEffect } from "react";
import { View, Text, Alert, BackHandler, Pressable } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const HomePage = () => {

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
    await SecureStore.deleteItemAsync('auth');
    router.replace('/login');
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Home Page</Text>
      <Pressable className="p-4 border-2" onPress={() => router.push("/users/create")}>
        <Text>
          Create Customer
        </Text>
      </Pressable>
      <Pressable className="p-4 border-2" onPress={() => logOut()}>
        <Text>
          Logout
        </Text>
      </Pressable>
    </View>
  );
};

export default HomePage;
