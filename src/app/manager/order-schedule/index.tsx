import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import useUtilityQuery from "../../../hooks/useUtilityQuery";
import useSearchBar from "../../../hooks/useSearchBar";
import OrderList from "../../../components/order/OrderList";

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
    });
  }, []);

  return (
    <OrderList
      searchText={searchText}
      componentOnPress={(order) => router.push(`/manager/order-schedule/${order.id}`)}
      refresh={refresh}
    />
  );
};

export default OrderListPage;