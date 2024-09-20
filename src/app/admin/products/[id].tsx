import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, Alert, ScrollView, Pressable, Modal } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import CustomError from "../../../components/CustomError";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import { AxiosError } from "axios";
import SubmitDialog from "../../../components/dialog/SubmitDialog";
import { deleteProduct, getProductById } from "../../../services/ProductService";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomHeader from "../../../components/CustomHeader";
import ProductPartList from "../../../components/part/ProductPartList";

const ProductPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isProductPartModalVisible, setProductPartModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Pressable
            className="p-1"
            onPress={() => setProductPartModalVisible(true)}
          >
            <FontAwesome5
              name="clipboard-list"
              size={28}
              color="darkslategray"
            />
          </Pressable>
        );
      },
    });
  }, []);

  const { isPending, mutate } = useMutation({
    mutationFn: () => deleteProduct(+id),
    onSuccess: () => {
      setDeleteDialogVisible(false);
      queryClient.invalidateQueries({ queryKey: ["fetchProductList"] });
      router.back();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      setDeleteDialogVisible(false);
      Alert.alert("Error!", error.response?.data?.message ?? error.message, [
        { text: "Close" },
      ]);
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetchProduct", id],
    queryFn: () => getProductById(+id),
    refetchOnWindowFocus: "always",
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log(error);
    return <CustomError errorMsg={error.message} />;
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="m-5">
        <View className="flex flex-col justify-center space-y-3">
          <View className="border-b-1">
            <Text className="text-base font-medium">Name:</Text>
            <Text className="text-base font-medium">
              {data?.data.product.name ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Description:</Text>
            <Text className="text-base font-medium">
              {data?.data.product.description ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Image:</Text>
            {data?.data.product.image ? (
              <Image
                className="h-48 w-48 mb-2"
                source={{
                  uri: `data:image/jpg;base64,${data?.data.product.image}`,
                }}
              />
            ) : (
              <Text className="text-base font-medium">No Image</Text>
            )}
          </View>
        </View>
        <View className="flex flex-row items-center mt-5">
          <Button
            mode="contained"
            className="w-24 rounded"
            buttonColor="red"
            textColor="white"
            labelStyle={{ fontWeight: "bold" }}
            onPress={() => setDeleteDialogVisible(true)}
          >
            Delete
          </Button>
        </View>
      </View>
      <SubmitDialog
        title={`Deleting ${data?.data.product.name}`}
        visible={isDeleteDialogVisible}
        loading={isPending}
        disabled={isPending}
        submitButtonText="Delete"
        onDismiss={() => setDeleteDialogVisible(false)}
        onPress={() => mutate()}
      >
        Are you sure you want to delete {data?.data.product.name} part?
      </SubmitDialog>
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
          <View className="flex-1">
            <ProductPartList data={data?.data.productPartList} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProductPage;
