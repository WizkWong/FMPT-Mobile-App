import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Pressable } from "react-native";
import useUtilityQuery from "../../../hooks/useUtilityQuery";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import useSearchBar from "../../../hooks/useSearchBar";
import OrderList from "../../../components/order/OrderList";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderListPage = () => {
  const navigation = useNavigation();
  const queryKey = ["fetchOrderList"];
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
      headerRight: () => {
        return (
          <Pressable onPress={() => router.push(`/admin/orders/create`)}>
            <SimpleLineIcons name="plus" size={28} color="black" />
          </Pressable>
        );
      },
    });
  }, []);

  return (
    <OrderList
      searchText={searchText}
      componentOnPress={(order) => {
        AsyncStorage.setItem("order", JSON.stringify(order));
        router.push(`/admin/orders/${order.id}`);
    }}
      refresh={refresh}
    />
  );
};

export default OrderListPage;