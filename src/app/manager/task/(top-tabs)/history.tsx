import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, FlatList } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import CustomError from "../../../../components/CustomError";
import TaskRenderItem from "../../../../components/task/TaskRenderItem";
import useSearchBar from "../../../../hooks/useSearchBar";
import useUserDetails from "../../../../hooks/useUserDetails";
import useUtilityQuery from "../../../../hooks/useUtilityQuery";
import { getTaskByFilter } from "../../../../services/TaskService";

const HistoryTaskListTabPage = () => {
  const navigation = useNavigation();
  const parent = navigation.getParent();
  const queryKey = ["fetchHistoryTaskList"];
  const utilityQuery = useUtilityQuery();
  const [userDetails, refreshUserDetails] = useUserDetails();

  const refresh = () => {
    utilityQuery.resetInfiniteQueryPagination(queryKey);
  };

  const [searchText, setSearchText] = useSearchBar(refresh);

  useEffect(() => {
    parent.setOptions({
      headerSearchBarOptions: {
        placeHolder: "Search",
        headerTransparent: false,
        onChangeText: (e) => setSearchText(e.nativeEvent.text),
      },
    });
    refreshUserDetails();
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
    queryFn: ({ pageParam }) => getTaskByFilter(pageParam, searchText, "history", userDetails?.department ?? ""),
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
  
  return (
    <View className="flex flex-col justify-center my-1">
      <FlatList
        data={data?.pages.flatMap((d) => d.data.taskList)}
        renderItem={({item}) => <TaskRenderItem task={item} componentOnPress={(task) => router.push(`/manager/task/${task.id}`)} />}
        ListEmptyComponent={() => (
          <CustomError errorMsg={error?.message ?? "No results of Tasks"} />
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

export default HistoryTaskListTabPage;