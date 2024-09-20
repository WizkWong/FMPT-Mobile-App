import { useCallback, useState } from "react";
import { View, Text, BackHandler, Pressable } from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import globalStyles from "../../constants/globalStyles";
import ExitAppDialog from "../../components/dialog/ExitAppDialog";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
    image: React.ReactNode;
  };

  const moduleList: module[] = [
    {
      title: "User",
      link: "/admin/users/list",
      image: <FontAwesome5 name="user-alt" size={24} color="black" />,
    },
    {
      title: "Department",
      link: "/admin/department",
      image: <MaterialIcons name="groups" size={36} color="black" />,
    },
    {
      title: "Product",
      link: "/admin/products/list",
      image: <MaterialCommunityIcons name="table-chair" size={36} color="black" />,
    },
    {
      title: "Product Part",
      link: "/admin/parts/list",
      image: <MaterialCommunityIcons name="ruler-square" size={36} color="black" />,
    },
    {
      title: "Order",
      link: "/admin/orders/list",
      image: <FontAwesome5 name="clipboard-list" size={36} color="black" />,
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
              className="w-[26%] m-3 p-2 flex flex-col items-center justify-center bg-white rounded"
              onPress={() => router.push(m.link)}
            >
              {m.image}
              <Text className="mt-2 text-xs text-center font-medium">{m.title}</Text>
            </Pressable>
          ))}
          <Pressable
            className="flex justify-center w-[26%] m-3 p-2 border-2 bg-amber-550 rounded"
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
