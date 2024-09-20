import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, Pressable, FlatList, Image, Text } from "react-native";
import useUtilityQuery from "../../../hooks/useUtilityQuery";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator, Avatar, Card, Icon } from "react-native-paper";
import CustomError from "../../../components/CustomError";
import useSearchBar from "../../../hooks/useSearchBar";
import { getOrderByFilter } from "../../../services/OrderService";
import { Order } from "../../../types/order";
import { Status } from "../../../types/enum";
import { convertToDateString } from "../../../utils/utility";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderList = () => {
  const navigation = useNavigation();
  const queryKey = ["fetchOrderList"];
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
        onChangeText: (e) => setSearchText(e.nativeEvent.text),
      },
      headerRight: () => {
        return (
          <Pressable onPress={() => router.push(`/admin/orders/create`)}>
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
    queryFn: ({ pageParam }) => getOrderByFilter(pageParam, searchText),
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

  const renderItem = ({ item }: { item: Order }) => {
    return (
      <Card
        className="mx-4 my-2 pr-3"
        onPress={() => {
          AsyncStorage.setItem("order", JSON.stringify(item));
          router.push(`/admin/orders/${item.id}`);
      }}
      >
        <Card.Title
          className="py-2"
          title={`Order ${item.id}`}
          subtitle={
            <>
              <Text>Product: {item.product.name}{"\n"}</Text>
              <Text>Quantity: {item.quantity}{"\n"}</Text>
              <Text>Status: {Status[item.status]}{"\n"}</Text>
              <Text>Deadline: {convertToDateString(item.deadlineDateTime)}{"\n"}</Text>
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
        data={data?.pages.flatMap((d) => d.data.orderList)}
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

export default OrderList