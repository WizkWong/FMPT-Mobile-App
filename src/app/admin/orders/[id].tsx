import { router, Stack } from "expo-router";
import { View, Text, Alert, ScrollView, Pressable, Modal } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useState } from "react";
import { getProductById } from "../../../services/ProductService";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomHeader from "../../../components/CustomHeader";
import ProductPartList from "../../../components/part/ProductPartList";
import useAsyncStorageGet from "../../../hooks/useAsyncStorageGet";
import { Order } from "../../../types/order";
import { Status } from "../../../types/enum";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const OrderDetailsPage = () => {
  const [isProductPartModalVisible, setProductPartModalVisible] = useState(false);
  const [order, setOrder] = useState<Order>({});

  useAsyncStorageGet<Order>({
    key: "order",
    onSuccess: (data) =>
      setOrder({
        id: data.id,
        description: data.description,
        product: data.product,
        quantity: data.quantity,
        status: data.status,
        deadlineDateTime: data.deadlineDateTime,
        createdDateTime: data.createdDateTime,
      }),
    onError: (error) => {
      Alert.alert("Error!", error.message, [
        { text: "Close & Go Back", onPress: () => router.back() },
      ]);
    },
  });

  const { data, refetch } = useQuery({
    queryKey: ["fetchProduct", order.product?.id],
    queryFn: () => getProductById(+order.product?.id),
    enabled: false,
  });

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <View className="flex flex-row items-center space-x-2">
                <Pressable
                  className="p-1"
                  onPress={() =>
                    router.push(`/admin/orders/schedule?orderId=${order.id}`)
                  }
                >
                  <MaterialIcons
                    name="schedule"
                    size={28}
                    color="darkslategray"
                  />
                </Pressable>
                <Pressable
                  className="p-1"
                  onPress={() => {
                    refetch();
                    setProductPartModalVisible(true);
                  }}
                >
                  <FontAwesome5
                    name="clipboard-list"
                    size={28}
                    color="darkslategray"
                  />
                </Pressable>
              </View>
            );
          },
        }}
      />
      <View className="m-5">
        <View className="flex flex-col justify-center space-y-3">
          <View className="border-b-1">
            <Text className="text-base font-medium">Order ID:</Text>
            <Text className="text-base font-medium">{order.id ?? "-"}</Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Product Name:</Text>
            <Text className="text-base font-medium">
              {order.product?.name ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Product Image:</Text>
            {order.product?.image ? (
              <Image
                className="h-48 w-48 mb-2"
                source={{
                  uri: `data:image/jpg;base64,${order.product?.image}`,
                }}
              />
            ) : (
              <Text className="text-base font-medium">No Image</Text>
            )}
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Description:</Text>
            <Text className="text-base font-medium">
              {order.description ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Quantity:</Text>
            <Text className="text-base font-medium">
              {order.quantity ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text>
              <Text className="text-base font-medium">Status:{" "}</Text>
              <Text
                className={`text-base font-medium ${
                  order.status === Status.COMPLETED
                    ? "text-green-600"
                    : order.status === Status.IN_PROGRESS
                    ? "text-blue-500"
                    : order.status === Status.PENDING
                    ? "text-yellow-600"
                    : order.status === Status.CANCELLED
                    ? "text-red-500"
                    : "text-gray-700"
                }`}
              >
                {Status.toString(order.status)}
              </Text>
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Deadline Date & time:</Text>
            <Text className="text-base font-medium">
              {order.deadlineDateTime ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Created Date & Time:</Text>
            <Text className="text-base font-medium">
              {order.createdDateTime ?? "-"}
            </Text>
          </View>
        </View>
      </View>
      <Modal
        visible={isProductPartModalVisible}
        onRequestClose={() => setProductPartModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <CustomHeader
            title={`${order.product?.name}\nPart Requirement`}
            onPressBack={() => setProductPartModalVisible(false)}
          />
          <View className="flex-1">
            <ProductPartList
              data={data?.data.productPartList}
              piecesMultiply={order.quantity}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default OrderDetailsPage;
