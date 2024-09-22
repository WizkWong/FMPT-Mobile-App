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
import config from "../../../constants/config";

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
    const nettSize =
      item.part.nettWidth == null &&
      item.part.nettHeight == null &&
      item.part.nettLength == null
        ? "-"
        : `${item.part.nettWidth}${config.unitOfMeasurement} x ${item.part.nettHeight}${config.unitOfMeasurement} x ${item.part.nettLength}${config.unitOfMeasurement}`;

    return (
      <Card
        className="mx-4 my-2"
        onPress={() => router.push(`/manager/task/${item.id}`)}
      >
        <Card.Title
          className="py-2"
          title={`Task ID: ${item.id}`}
          subtitle={
            <>
              <Text>Order ID: {item.orderId}{"\n"}</Text>
              <Text>Product: {item.product.name}{"\n"}</Text>
              <Text>Department: {item.department}{"\n"}</Text>
              <Text>Status: {Status[item.status]}</Text>
            </>
          }
          subtitleNumberOfLines={6}
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
          right={(props) => (
            <View className="pr-3">
              <Icon {...props} source="chevron-right" />
            </View>
          )}
        />
        <Card.Content className="py-2 border-t-1 border-gray-200">
          <Text className="text-base">{item.part.name}</Text>
          <View className="flex flex-row space-x-2 items-center py-1">
            {item.part.image ? (
              <Image
                className="h-11 w-11"
                source={{
                  uri: `data:image/jpg;base64,${item.part.image}`,
                }}
              />
            ) : (
              <Avatar.Icon
                className="rounded-none bg-amber-500"
                color="white"
                size={45}
                icon="image-off-outline"
              />
            )}
            <View className="flex flex-col space-y-1">
              <Text>Grade: {item.part.grade}</Text>
              <Text>Nett Size:</Text>
              <Text>{nettSize}</Text>
              <Text>Quantity: {item.targetQuantity}</Text>
            </View>
          </View>
        </Card.Content>
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