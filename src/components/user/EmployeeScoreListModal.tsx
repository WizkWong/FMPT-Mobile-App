import { useInfiniteQuery } from "@tanstack/react-query";
import { View, Text, Modal, FlatList } from "react-native";
import { getEmployeeByFilter } from "../../services/UserService";
import { Employee } from "../../types/user";
import { ActivityIndicator, Avatar, Card, Icon } from "react-native-paper";
import useUtilityQuery from "../../hooks/useUtilityQuery";
import CustomError from "../../components/CustomError";
import { capitalizedCase } from "../../utils/utility";
import useSearchBar from "../../hooks/useSearchBar";
import CustomHeader from "../CustomHeader";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const EmployeeScoreListModal = ({
  visible,
  onModalClose,
  componentOnPress,
  partProcedureId = null,
  filterByDepartment = "",
}: {
  visible: boolean;
  onModalClose: () => void;
  componentOnPress?: (employee: Employee) => void;
  partProcedureId?: number;
  filterByDepartment?: string;
}) => {
  const queryKey = ["fetchEmployeeList"];
  const utilityQuery = useUtilityQuery();
  const refresh = () => utilityQuery.resetInfiniteQueryPagination(queryKey);
  const [searchText, setSearchText] = useSearchBar(refresh);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam }) =>
      getEmployeeByFilter(pageParam, searchText, partProcedureId, filterByDepartment),
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

  const renderItem = ({ item }: { item: Employee }) => {
    return (
      <Card className="mx-4 my-2 pr-3" onPress={() => componentOnPress(item)}>
        <Card.Title
          className="py-2"
          title={
            <View className="flex flex-row items-center space-x-2">
              <Text className="font-semibold text-[15px]">{item.username}</Text>
              {item.score >= 70 ? (
                <AntDesign name="like1" size={15} color="green" />
              ) : item.score >= 40 ? (
                <FontAwesome6 name="equals" size={15} color="#ca8a04" />
              ) : item.score > 0 ? (
                <AntDesign name="dislike1" size={15} color="red" />
              ) : (
                <></>
              )}
            </View>
          }
          subtitle={
            <>
              <Text className="text-gray-500 font-bold">Role: </Text>
              <Text>
                {capitalizedCase(item.role)}
                {"\n"}
              </Text>
              <Text className="text-gray-500 font-bold">Department: </Text>
              <Text>
                {item.department}
                {"\n"}
              </Text>
              <Text className="text-gray-500 font-bold">Average Score: </Text>
              <Text
                className={`font-semibold ${
                  item.score >= 70
                    ? "text-green-600"
                    : item.score >= 40
                    ? "text-yellow-600"
                    : item.score > 0
                    ? "text-red-500"
                    : "text-gray-700"
                }`}
              >
                {item.score === 0 ? "-" : item.score}
              </Text>
            </>
          }
          subtitleNumberOfLines={4}
          subtitleStyle={{ fontSize: 12, color: "#4b5563" }}
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
    <Modal
      visible={visible}
      onRequestClose={onModalClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        <CustomHeader
          title="Assign an Employee"
          onPressBack={onModalClose}
          searchBarEnabled={true}
          searchText={searchText}
          onChangeSearchText={(text) => setSearchText(text)}
        />
        <View className="mb-10">
          <FlatList
            className="py-1"
            data={data?.pages.flatMap((d) => d.data.employeeList)}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <CustomError
                errorMsg={error?.message ?? "No results of Employees"}
              />
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
      </View>
    </Modal>
  );
};

export default EmployeeScoreListModal;
