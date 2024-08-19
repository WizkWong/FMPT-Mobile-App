import { useQuery } from "@tanstack/react-query";
import { View, Text, FlatList, Pressable } from "react-native";
import { getAllUsers } from "../../services/UserService";
import { Link, router, useNavigation } from "expo-router";
import { User } from "../../types/user";
import { Image } from "expo-image";
import { useEffect } from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const UserListPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeHolder: "Search",
        headerTransparent: false,
        onChangeText: (e) => {
          console.log(e.nativeEvent.text);
        },
      },
      headerRight: () => {
        return (
          <Pressable onPress={() => router.push(`users/create`)}>
            <SimpleLineIcons name="plus" size={28} color="black" />
          </Pressable>
        );
      },
    });
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["fetchUserList"],
    queryFn: () => getAllUsers(),
    staleTime: 60000,
  });

  const renderItem = ({ item }: { item: User }) => {
    return (
      <Link
        className="p-2 border-2 rounded my-1"
        push
        href={`/users/${item.id}`}
      >
        <View className="flex flex-row justify-center items-center space-x-4">
          <Image
            className="p-8 rounded-full"
            source={
              item.image
                ? { uri: `data:image/jpg;base64,${item.image}` }
                : require("../../assets/default-profile-img.svg")
            }
          />
          <Text className="text-base font-semibold">{item.username}</Text>
        </View>
      </Link>
    );
  };

  const renderError = () => {
    return <Text className="text-lg font-medium">Empty Users</Text>;
  };

  return (
    <View className="flex flex-col justify-center mx-5 my-2">
      <FlatList
        data={data?.data ?? []}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text className="text-lg font-medium">Empty Users</Text>
        )}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={() => refetch()}
        refreshing={isLoading}
      />
    </View>
  );
};

export default UserListPage;
