import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, FlatList } from "react-native";
import useUtilityQuery from "../../../hooks/useUtilityQuery";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import CustomError from "../../../components/CustomError";
import useSearchBar from "../../../hooks/useSearchBar";
import { getEmployeeTaskByFilter } from "../../../services/TaskService";
import TaskRenderItem from "../../../components/task/TaskRenderItem";

const TaskListPage = () => {
  const navigation = useNavigation();
  const queryKey = ["fetchTaskList"];
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
    queryFn: ({ pageParam }) => getEmployeeTaskByFilter(pageParam, searchText),
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
        renderItem={({ item }) => (
          <TaskRenderItem
            task={item}
            componentOnPress={(task) =>
              router.push(`/employee/task/${task.id}`)
            }
          />
        )}
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