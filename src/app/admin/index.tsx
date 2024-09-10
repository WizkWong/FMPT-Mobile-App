import { useCallback, useState } from "react";
import { View, Text, BackHandler, Pressable } from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import globalStyles from "../../constants/globalStyles";
import ExitAppDialog from "../../components/dialog/ExitAppDialog";

const AdminPage = () => {
  const queryClient = useQueryClient();
  const [isExitAppDialogVisible, setExitAppDialogVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          setExitAppDialogVisible(true);
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
    {
      title: "Manage Department",
      link: "/department",
      image: require("../../assets/default-profile-img.svg"),
    },
    {
      title: "Manage Product",
      link: "/products/list",
      image: require("../../assets/default-profile-img.svg"),
    },
    {
      title: "Manage Part",
      link: "/parts/list",
      image: require("../../assets/default-profile-img.svg"),
    },
    {
      title: "Manage Orders",
      link: "/orders/list",
      image: require("../../assets/default-profile-img.svg"),
    },
  ];

  return (
    <>
      <View className="flex-1 items-center justify-center">
        <Text>Admin Page</Text>
        <View className="flex flex-row flex-wrap bg-zinc-200 p-3">
          {moduleList.map((m, id) => (
            <Pressable
              key={id}
              style={globalStyles.shadow}
              className="w-[26%] mx-3 my-1 p-1 flex flex-col items-center bg-white rounded"
              onPress={() => router.push(m.link)}
            >
              <Image className="p-6" source={m.image} />
              <Text className="text-xs text-center font-medium">{m.title}</Text>
            </Pressable>
          ))}
          <Pressable
            className="flex justify-center w-[26%] mx-3 my-1 p-1 border-2 bg-amber-550 rounded"
            style={globalStyles.shadow}
            onPress={() => logOut()}
          >
            <Text className="text-center font-medium">Logout</Text>
          </Pressable>
        </View>
      </View>
      <ExitAppDialog
        visible={isExitAppDialogVisible}
        onDismiss={() => setExitAppDialogVisible(false)}
      />
    </>
  );
};

export default AdminPage;
