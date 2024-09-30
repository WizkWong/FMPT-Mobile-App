import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback } from "react";
import { View, FlatList } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import CustomError from "../../../../components/CustomError";
import TaskRenderItem from "../../../../components/task/TaskRenderItem";
import useSearchBar from "../../../../hooks/useSearchBar";
import useUtilityQuery from "../../../../hooks/useUtilityQuery";
import { getEmployeeTaskByFilter } from "../../../../services/TaskService";

const HistoryTaskListTabPage = () => {
  const navigation = useNavigation();
  const parent = navigation.getParent();
  const typeTask = "history";
  const queryKey = ["fetchTaskList", typeTask];
  const utilityQuery = useUtilityQuery();

  const refresh = () => {
    utilityQuery.resetInfiniteQueryPagination(queryKey);
  };

  const [searchText, setSearchText] = useSearchBar(refresh);

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
    queryFn: ({ pageParam }) => getEmployeeTaskByFilter(pageParam, searchText, typeTask),
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
      renderItem={({ item }) => (
        <TaskRenderItem
          task={item}
          componentOnPress={(task) =>
            router.push(`/employee/task/${task.id}`)
          }
        />
      )}
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

export default HistoryTaskListTabPage;