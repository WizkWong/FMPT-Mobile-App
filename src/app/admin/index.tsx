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
import Ionicons from "@expo/vector-icons/Ionicons";

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
    onPress: () => void;
    image: React.ReactNode;
  };

  const moduleList: module[] = [
    {
      title: "User",
      onPress: () => router.push("/admin/users/list"),
      image: <FontAwesome5 name="user-alt" size={24} color="#111827" />,
    },
    {
      title: "Department",
      onPress: () => router.push("/admin/department"),
      image: <MaterialIcons name="groups" size={36} color="#111827" />,
    },
    {
      title: "Product",
      onPress: () => router.push("/admin/products/list"),
      image: <MaterialCommunityIcons name="table-chair" size={36} color="#111827" />,
    },
    {
      title: "Product Part",
      onPress: () => router.push("/admin/parts/list"),
      image: <MaterialCommunityIcons name="ruler-square" size={36} color="#111827" />,
    },
    {
      title: "Order",
      onPress: () => router.push("/admin/orders/list"),
      image: <FontAwesome5 name="clipboard-list" size={36} color="#111827" />,
    },
    {
      title: "Analytic",
      onPress: () => router.push("/admin/analytic"),
      image: <Ionicons name="analytics" size={36} color="#111827" />,
    },
    {
      title: "Logout",
      onPress: () => logOut(),
      image: <MaterialIcons name="logout" size={36} color="#111827" />,
    },
  ];

  return (
    <>
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl text-gray-700 font-medium">Administrator</Text>
        <View className="flex flex-row flex-wrap bg-zinc-200 p-3 mt-8">
          {moduleList.map((m, id) => (
            <Pressable
              key={id}
              style={globalStyles.shadow}
              className="w-[26%] m-3 p-2 flex flex-col items-center justify-center bg-white rounded"
              onPress={m.onPress}
            >
              {m.image}
              <Text className="mt-2 text-xs text-center font-medium">{m.title}</Text>
            </Pressable>
          ))}
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
