import { Pressable } from "react-native";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import useUtilityQuery from "../../../hooks/useUtilityQuery";
import useSearchBar from "../../../hooks/useSearchBar";
import UserList from "../../../components/user/UserList";

const UserListPage = () => {
  const navigation = useNavigation();
  const queryKey = ["fetchUserList"];
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
        onChangeText: (e) => {
          setSearchText(e.nativeEvent.text);
        },
      },
      headerRight: () => {
        return (
          <Pressable onPress={() => router.push(`/admin/users/create`)}>
            <SimpleLineIcons name="plus" size={28} color="black" />
          </Pressable>
        );
      },
    });
  }, []);

  return (
    <UserList
      searchText={searchText}
      componentOnPress={(user) => router.push(`/admin/users/${user.id}`)}
      refresh={refresh}
    />
  );
};

export default UserListPage;
