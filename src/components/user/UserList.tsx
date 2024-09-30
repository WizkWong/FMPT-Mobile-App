import { useInfiniteQuery } from "@tanstack/react-query";
import { View, FlatList } from "react-native";
import { getUserByFilter } from "../../services/UserService";
import { User } from "../../types/user";
import { ActivityIndicator, Avatar, Card, Icon } from "react-native-paper";
import useUtilityQuery from "../../hooks/useUtilityQuery";
import CustomError from "../../components/CustomError";
import { capitalizedCase } from "../../utils/utility";
import { UserRole } from "../../types/enum";

const UserList = ({
  searchText,
  componentOnPress,
  refresh,
  filterByDepartment = "",
  filterByRole,
}: {
  searchText: string;
  componentOnPress?: (user: User) => void;
  refresh?: () => void;
  filterByDepartment?: string;
  filterByRole?: UserRole;
}) => {
  const queryKey = ["fetchUserList"];
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
    queryFn: ({ pageParam }) => getUserByFilter(pageParam, searchText, filterByDepartment, filterByRole),
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

  const renderItem = ({ item }: { item: User }) => {
    return (
      <Card
        className="mx-4 my-2 pr-3"
        onPress={() => componentOnPress(item)}
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
              <Avatar.Icon
                {...props}
                className="bg-amber-500"
                size={45}
                color="white"
                icon="account"
              />
            )
          }
          right={(props) => <Icon {...props} source="chevron-right" />}
        />
      </Card>
    );
  };

  return (
    <FlatList
      data={data?.pages.flatMap((d) => d.data.userList)}
      renderItem={renderItem}
      ListEmptyComponent={() => (
        <CustomError errorMsg={error?.message ?? "No results of Users"} />
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

export default UserList;
