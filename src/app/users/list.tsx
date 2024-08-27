import { useInfiniteQuery } from "@tanstack/react-query";
import { View, Text, FlatList, Pressable } from "react-native";
import { getUserByFilter } from "../../services/UserService";
import { Link, router, useFocusEffect, useNavigation } from "expo-router";
import { User } from "../../types/user";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { ActivityIndicator } from "react-native-paper";
import useUtilityQuery from "../../hooks/useUtilityQuery";

const UserListPage = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout>(null);
  const queryKey = ["fetchUserList"];
  const utilityQuery = useUtilityQuery();

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeHolder: "Search",
        headerTransparent: false,
        onChangeText: (e) => {
          setSearchText(e.nativeEvent.text);
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam }) => getUserByFilter(pageParam, searchText),
    initialPageParam: 0,
    staleTime: 60000,
    getNextPageParam: (lastPage, pages, lastPageParam) =>
      lastPage.data.hasNext ? lastPageParam + 1 : null,
  });

  const fetchMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const refresh = () => {
    utilityQuery.resetInfiniteQueryPagination(queryKey);
    refetch();
  };

  useFocusEffect(
    useCallback(() => {
      if (timer !== null) {
        clearTimeout(timer);
        setTimer(null);
      }
      const timerId = setTimeout(() => {
        refresh();
        setTimer(null);
      }, 500);
      setTimer(timerId);
    }, [searchText])
  );

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

  return (
    <View className="flex flex-col justify-center mx-5 my-2">
      <FlatList
        data={data?.pages.flatMap((d) => d.data.userList)}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text className="text-lg font-medium">Empty Users</Text>
        )}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={refresh}
        refreshing={isFetching}
        onEndReached={fetchMore}
        onEndReachedThreshold={0}
        ListFooterComponent={
          <ActivityIndicator animating={isFetchingNextPage} />
        }
      />
    </View>
  );
};

export default UserListPage;
