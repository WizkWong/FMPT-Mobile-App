import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { View, Text, Alert, BackHandler, Pressable } from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";

const HomePage = () => {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

  const logOut = async () => {
    queryClient.removeQueries();
    await SecureStore.deleteItemAsync("auth");
    router.replace("/login");
  };

  type module = {
    title: string;
    link: string;
    image: string;
  };

  const moduleList: module[] = [
    {
      title: "Manage User",
      link: "/users/list",
      image: require("../../assets/default-profile-img.svg"),
    },
  ];

  const styles = StyleSheet.create({
    shadow: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
  });

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Home Page</Text>
      <View className="flex flex-row flex-wrap bg-zinc-200 p-3">
        {moduleList.map((m, id) => (
          <Pressable
            key={id}
            style={styles.shadow}
            className="w-[26%] mx-3 my-1 p-1 flex flex-col items-center bg-white rounded"
            onPress={() => router.push(m.link)}
          >
            <Image className="p-6" source={m.image} />
            <Text className="text-xs text-center font-medium">{m.title}</Text>
          </Pressable>
        ))}
        <Pressable
          className="flex justify-center w-[26%] mx-3 my-1 p-1 border-2 bg-amber-550 rounded"
          style={styles.shadow}
          onPress={() => logOut()}
        >
          <Text className="text-center font-medium">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HomePage;
