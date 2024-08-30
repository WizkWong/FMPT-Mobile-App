import { useInfiniteQuery } from "@tanstack/react-query";
import { View, FlatList, Pressable } from "react-native";
import { getUserByFilter } from "../../services/UserService";
import { router, useNavigation } from "expo-router";
import { User } from "../../types/user";
import { useEffect } from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { ActivityIndicator, Avatar, Card, Icon } from "react-native-paper";
import useUtilityQuery from "../../hooks/useUtilityQuery";
import { capitalizedCase } from "../../utils/format";
import CustomError from "../../components/CustomError";
import useSearchBar from "../../hooks/useSearchBar";

const UserListPage = () => {
  const navigation = useNavigation();
  const queryKey = ["fetchUserList"];
  const utilityQuery = useUtilityQuery();

  const refresh = () => {
    utilityQuery.resetInfiniteQueryPagination(queryKey);
  };

  const [searchText, setSearchText] = useSearchBar(refresh);

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
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
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

  const renderItem = ({ item }: { item: User }) => {
    return (
      <Card
        className="mx-4 my-2 pr-3"
        onPress={() => router.push(`/users/${item.id}`)}
      >
        <Card.Title
          className="py-2"
          title={item.username}
          subtitle={`Role: ${capitalizedCase(item.role)}\nDepartment: ${
            item.department
          }`}
          subtitleNumberOfLines={2}
          left={(props) =>
            item.image ? (
              <Avatar.Image
                {...props}
                size={45}
                source={{ uri: `data:image/jpg;base64,${item.image}` }}
              />
            ) : (
              <Avatar.Icon {...props} size={45} icon="account" />
            )
          }
          right={(props) => <Icon {...props} source="chevron-right" />}
        />
      </Card>
    );
  };

  return (
    <View className="flex flex-col justify-center my-1">
      <FlatList
        data={data?.pages.flatMap((d) => d.data.userList)}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <CustomError errorMsg={error.message ?? "No results of Users"} />
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
