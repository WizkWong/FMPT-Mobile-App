import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect } from "react";
import { View, FlatList } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import CustomError from "../../../../components/CustomError";
import TaskRenderItem from "../../../../components/task/TaskRenderItem";
import useSearchBar from "../../../../hooks/useSearchBar";
import useUserDetails from "../../../../hooks/useUserDetails";
import useUtilityQuery from "../../../../hooks/useUtilityQuery";
import { getTaskByFilter } from "../../../../services/TaskService";

const ActiveTaskListTabPage = () => {
  const navigation = useNavigation();
  const parent = navigation.getParent();
  const typeTask = "active";
  const queryKey = ["fetchTaskList", typeTask];
  const utilityQuery = useUtilityQuery();
  const [userDetails, refreshUserDetails] = useUserDetails();

  const refresh = () => {
    utilityQuery.resetInfiniteQueryPagination(queryKey);
  };

  const [searchText, setSearchText] = useSearchBar(refresh);

  useEffect(() => {
    refreshUserDetails();
  }, []);

  useFocusEffect(
    useCallback(() => {
      parent.setOptions({
        headerSearchBarOptions: {
          placeHolder: "Search",
          headerTransparent: false,
          onChangeText: (e) => setSearchText(e.nativeEvent.text),
        },
      });
    }, [])
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam }) => getTaskByFilter(pageParam, searchText, typeTask, userDetails?.department ?? ""),
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
    <FlatList
      className="py-1"
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
  );
};

export default ActiveTaskListTabPage;