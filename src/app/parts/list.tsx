import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Pressable } from "react-native";
import useUtilityQuery from "../../hooks/useUtilityQuery";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import useSearchBar from "../../hooks/useSearchBar";
import PartList from "../../components/part/PartList";

const PartListPage = () => {
  const navigation = useNavigation();
  const utilityQuery = useUtilityQuery();

  const refresh = () => utilityQuery.resetInfiniteQueryPagination(["fetchPartList"]);
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
          <Pressable onPress={() => router.push(`parts/create`)}>
            <SimpleLineIcons name="plus" size={28} color="black" />
          </Pressable>
        );
      },
    });
  }, []);

  return (
    <PartList
      searchText={searchText}
      componentOnPress={(part) => router.push(`/parts/${part.id}`)}
      refresh={refresh}
    />
  );
};

export default PartListPage;
