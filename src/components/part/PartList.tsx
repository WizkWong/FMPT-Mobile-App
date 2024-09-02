import { View, FlatList, Image } from "react-native";
import useUtilityQuery from "../../hooks/useUtilityQuery";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPartByFilter } from "../../services/PartService";
import { Part } from "../../types/productPart";
import { ActivityIndicator, Avatar, Card, Icon } from "react-native-paper";
import CustomError from "../../components/CustomError";
import config from "../../constants/config";

const PartList = ({
  searchText,
  componentOnPress,
  refresh,
}: {
  searchText: string;
  componentOnPress?: (part: Part) => void;
  refresh?: () => void;
}) => {
  const queryKey = ["fetchPartList"];
  const utilityQuery = useUtilityQuery();
  refresh = refresh ?? (() => utilityQuery.resetInfiniteQueryPagination(queryKey));

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam }) => getPartByFilter(pageParam, searchText),
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

  const renderItem = ({ item }: { item: Part }) => {
    return (
      <Card
        className="mx-4 my-2 pr-3"
        onPress={() => componentOnPress(item)}
      >
        <Card.Title
          className="py-2"
          title={item.name}
          subtitle={`Grade: ${item.grade}\nNett Size:\n${item.nettWidth}${config.unitOfMeasurement} x ${item.nettHeight}${config.unitOfMeasurement} x ${item.nettLength}${config.unitOfMeasurement}`}
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
        data={data?.pages.flatMap((d) => d.data.partList)}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <CustomError errorMsg={error?.message ?? "No results of Parts"} />
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

export default PartList;
