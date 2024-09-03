import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, Pressable, FlatList, Image } from "react-native";
import useUtilityQuery from "../../hooks/useUtilityQuery";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductByFilter } from "../../services/ProductService";
import { Product } from "../../types/productPart";
import { ActivityIndicator, Avatar, Card, Icon } from "react-native-paper";
import CustomError from "../../components/CustomError";
import useSearchBar from "../../hooks/useSearchBar";

const ProductListPage = () => {
  const navigation = useNavigation();
  const queryKey = ["fetchProductList"];
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
          <Pressable onPress={() => router.push(`products/create`)}>
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
    queryFn: ({ pageParam }) => getProductByFilter(pageParam, searchText),
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

  const renderItem = ({ item }: { item: Product }) => {
    return (
      <Card
        className="mx-4 my-2 pr-3"
        onPress={() => router.push(`/products/${item.id}`)}
      >
        <Card.Title
          className="py-2"
          title={item.name}
          subtitle={`Description: ${item.description}`}
          subtitleNumberOfLines={3}
          left={(props) =>
            item.image ? (
              <Image
                className="h-11 w-11"
                source={{
                  uri: `data:image/jpg;base64,${item.image}`,
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
        data={data?.pages.flatMap((d) => d.data.productList)}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <CustomError errorMsg={error?.message ?? "No results of Products"} />
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

export default ProductListPage;
