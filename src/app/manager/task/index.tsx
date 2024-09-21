import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, FlatList, Image, Text } from "react-native";
import useUtilityQuery from "../../../hooks/useUtilityQuery";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator, Avatar, Card, Icon, Searchbar } from "react-native-paper";
import CustomError from "../../../components/CustomError";
import useSearchBar from "../../../hooks/useSearchBar";
import { getTaskByFilter } from "../../../services/TaskService";
import { Task } from "../../../types/task";
import { Status } from "../../../types/enum";
import useUserDetails from "../../../hooks/useUserDetails";

const TaskListPage = () => {
  const navigation = useNavigation();
  const queryKey = ["fetchTaskList"];
  const utilityQuery = useUtilityQuery();
  const [userDetails] = useUserDetails();

  const refresh = () => {
    utilityQuery.resetInfiniteQueryPagination(queryKey);
  };

  const [searchText, setSearchText] = useSearchBar(refresh);

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeHolder: "Search",
        headerTransparent: false,
        onChangeText: (e) => setSearchText(e.nativeEvent.text),
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
    queryFn: ({ pageParam }) => getTaskByFilter(pageParam, searchText, userDetails?.department ?? ""),
    initialPageParam: 0,
    staleTime: Infinity,
    getNextPageParam: (lastPage, pages, lastPageParam) =>
      lastPage.data.hasNext ? lastPageParam + 1 : null,
  });

  const fetchMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item }: { item: Task }) => {
    return (
      <Card
        className="mx-4 my-2 pr-3"
        onPress={() => router.push(`/manager/task/${item.id}`)}
      >
        <Card.Title
          className="py-2"
          title={`ID: ${item.id}`}
          subtitle={
            <>
              <Text>Product: {item.product.name}{"\n"}</Text>
              <Text>Quantity: {item.targetQuantity}{"\n"}</Text>
              <Text>Department: {item.department}{"\n"}</Text>
              <Text>Status: {Status[item.status]}{"\n"}</Text>
            </>
          }
          subtitleNumberOfLines={4}
          subtitleStyle={{ fontSize: 14 }}
          left={(props) =>
            item.product.image ? (
              <Image
                className="h-11 w-11"
                source={{
                  uri: `data:image/jpg;base64,${item.product.image}`,
                }}
              />
            ) : (
              <Avatar.Icon
                className="rounded-none bg-amber-500"
                {...props}
                color="white"
                size={45}
                icon="image-off-outline"
              />
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
        data={data?.pages.flatMap((d) => d.data.taskList)}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <CustomError errorMsg={error?.message ?? "No results of Orders"} />
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

export default TaskListPage;