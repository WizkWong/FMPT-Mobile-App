import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useNavigation } from "expo-router";
import { AxiosError } from "axios";
import { ProductErrorField } from "../../types/form";
import { Product, ProductPart } from "../../types/productPart";
import { createProduct } from "../../services/ProductService";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import InputWithError from "../../components/InputWithError";
import ImageInput from "../../components/ImageInput";
import CustomHeader from "../../components/CustomHeader";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import PartList from "../../components/part/PartList";
import useUtilityQuery from "../../hooks/useUtilityQuery";
import useSearchBar from "../../hooks/useSearchBar";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import ProductPartList from "../../components/part/ProductPartList";

const CreateProductPage = () => {
  const queryClient = useQueryClient();
  const [product, setProduct] = useState<Product>({});
  const [productPartList, setProductPartList] = useState<ProductPart[]>([]);
  const [errorField, setErrorField] = useState<ProductErrorField>({});
  const [isPartModalVisible, setPartModalVisible] = useState(false);
  const [isProductPartModalVisible, setProductPartModalVisible] = useState(false);
  const utilityQuery = useUtilityQuery();
  const refresh = () => utilityQuery.resetInfiniteQueryPagination(["fetchPartList"]);
  const [searchText, setSearchText] = useSearchBar(refresh);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View className="flex flex-row items-center space-x-3">
            <Pressable onPress={() => setProductPartModalVisible(true)}>
              <FontAwesome5 name="clipboard-list" size={28} color="black" />
            </Pressable>
            <Pressable onPress={() => setPartModalVisible(true)}>
              <SimpleLineIcons name="plus" size={28} color="black" />
            </Pressable>
          </View>
        );
      },
    });
  }, []);

  const { isPending, mutate } = useMutation({
    mutationFn: () => createProduct({ product, productPartList }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchProductList"] });
      router.back();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      const errorMsg = error.response?.data?.message?.split("\n");
      if (errorMsg?.length !== 0) {
        setErrorField({
          name: errorMsg.find((msg) => msg.includes("Product name")),
        });
      }
    },
  });

  const handleClick = () => {
    const error: ProductErrorField = {};
    if (!product.name) {
      error.name = "Name cannot be empty!";
    }
    if (productPartList.length === 0) {
      error.productPartList = "Product must contain at least one Part!";
    }
    if (Object.keys(error).length !== 0) {
      setErrorField(error);
      return;
    }
    setErrorField({});
    mutate();
  };

  return (
    <ScrollView>
      <View className="flex-1 flex-col justify-between mx-5 mt-1 mb-5">
        <View className="flex flex-col space-y-2">
          <InputWithError
            label="Name"
            onChangeText={(text) => setProduct({ ...product, name: text })}
            value={product.name}
            errorMsg={errorField.name}
          />
          <InputWithError
            label="Description"
            onChangeText={(text) =>
              setProduct({ ...product, description: text })
            }
            value={product.description}
          />
          <View>
            <Text className="text-base font-medium mb-3">Image</Text>
            <ImageInput
              label="Select Image"
              image={product.image}
              setImage={(img) => setProduct({ ...product, image: img.base64 })}
            />
          </View>
          <Modal
            visible={isPartModalVisible}
            onRequestClose={() => setPartModalVisible(false)}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            <View className="flex-1 bg-white">
              <CustomHeader
                title="Select & Add Parts"
                onPressBack={() => setPartModalVisible(false)}
                searchBarEnabled={true}
                searchText={searchText}
                onChangeSearchText={(text) => setSearchText(text)}
              />
              <View className="mb-10">
                <PartList
                  searchText={searchText}
                  componentOnPress={(part) => {
                    setProductPartList((prev) => {
                      const foundIndex = prev.findIndex(
                        (item) => item.part?.id === part.id
                      );
                      if (foundIndex >= 0) {
                        prev[foundIndex].piece += 1;
                        return [...prev];
                      }
                      return [...prev, { part, piece: 1 }];
                    });
                    setPartModalVisible(false);
                  }}
                  refresh={refresh}
                />
              </View>
            </View>
          </Modal>
          <Modal
            visible={isProductPartModalVisible}
            onRequestClose={() => setProductPartModalVisible(false)}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            <View className="flex-1 bg-white">
              <CustomHeader
                title="Part List Requirement"
                onPressBack={() => setProductPartModalVisible(false)}
              />
              <View className="mb-10">
                <ProductPartList data={productPartList} />
              </View>
            </View>
          </Modal>
        </View>
        <View>
          <Button
            mode="contained-tonal"
            className="mt-5 bg-amber-550 rounded font-bold"
            textColor="white"
            labelStyle={{ fontWeight: "bold" }}
            onPress={handleClick}
            loading={isPending}
            disabled={isPending}
          >
            Create
          </Button>
          {errorField.productPartList && (
            <Text className="mt-1 text-sm text-red-500">
              {errorField.productPartList}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateProductPage;
