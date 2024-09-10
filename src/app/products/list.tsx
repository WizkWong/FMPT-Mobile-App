import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Pressable } from "react-native";
import useUtilityQuery from "../../hooks/useUtilityQuery";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import useSearchBar from "../../hooks/useSearchBar";
import ProductList from "../../components/product/ProductList";

const ProductListPage = () => {
  const navigation = useNavigation();
  const utilityQuery = useUtilityQuery();

  const refresh = () => utilityQuery.resetInfiniteQueryPagination(["fetchProductList"]);
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
          <Pressable onPress={() => router.push(`products/create`)}>
            <SimpleLineIcons name="plus" size={28} color="black" />
          </Pressable>
        );
      },
    });
  }, []);

  return (
    <ProductList
      searchText={searchText}
      componentOnPress={(product) => router.push(`/products/${product.id}`)}
      refresh={refresh}
    />
  );
};

export default ProductListPage;
