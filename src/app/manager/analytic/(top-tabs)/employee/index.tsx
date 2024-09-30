import { router } from "expo-router";
import useUtilityQuery from "../../../../../hooks/useUtilityQuery";
import useSearchBar from "../../../../../hooks/useSearchBar";
import UserList from "../../../../../components/user/UserList";
import { UserRole } from "../../../../../types/enum";
import { Searchbar } from "react-native-paper";
import { View } from "react-native";

const EmployeeListPage = () => {
  const queryKey = ["fetchUserList"];
  const utilityQuery = useUtilityQuery();

  const refresh = () => {
    utilityQuery.resetInfiniteQueryPagination(queryKey);
  };

  const [searchText, setSearchText] = useSearchBar(refresh);

  return (
    <View className="mb-10">
      <Searchbar
        placeholder="Search Employee"
        onChangeText={setSearchText}
        value={searchText}
        inputStyle={{ color: "#374151", fontSize: 13 }}
        style={{
          borderRadius: 0,
          backgroundColor: "white",
        }}
      />
      <UserList
        searchText={searchText}
        componentOnPress={(user) =>
          router.push(`/manager/analytic/employee/${user.id}`)
        }
        refresh={refresh}
        filterByRole={UserRole.EMPLOYEE}
      />
    </View>
  );
};

export default EmployeeListPage;
