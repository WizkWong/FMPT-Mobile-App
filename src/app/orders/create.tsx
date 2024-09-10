import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { AxiosError } from "axios";
import { OrderErrorField } from "../../types/form";
import InputWithError from "../../components/InputWithError";
import { View, ScrollView, Alert, Text, Pressable, Modal, TextInput } from "react-native";
import { Button } from "react-native-paper";
import { Order } from "../../types/order";
import { createOrder } from "../../services/OrderService";
import useUtilityQuery from "../../hooks/useUtilityQuery";
import useSearchBar from "../../hooks/useSearchBar";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomHeader from "../../components/CustomHeader";
import ProductList from "../../components/product/ProductList";
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { convertToDateString } from "../../utils/utility";

const CreateOrderPage = () => {
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<Order>({
    quantity: 0,
  });
  const [date, setDate] = useState<Date>(new Date());
  const [errorField, setErrorField] = useState<OrderErrorField>({});
  const [isProductModalVisible, setProductModalVisible] = useState(false);
  const utilityQuery = useUtilityQuery();
  const refresh = () => utilityQuery.resetInfiniteQueryPagination(["fetchProductList"]);
  const [searchText, setSearchText] = useSearchBar(refresh);

  const { isPending, mutate } = useMutation({
    mutationFn: () => createOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchOrderList"] });
      router.back();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      Alert.alert("Error!", error.response?.data?.message ?? error.message, [
        { text: "Close" },
      ]);
    },
  });

  const handleClick = () => {
    const error: OrderErrorField = {};
    if (!order.product) {
      error.product = "Product cannot be empty!";
    }
    if (!order.quantity || order.quantity === 0) {
      error.quantity = "Quantity cannot be zero or empty!";
    }
    if (!order.deadlineDateTime) {
      error.deadlineDateTime = "Deadline Date cannot be empty!";
    }
    if (Object.keys(error).length !== 0) {
      setErrorField(error);
      return;
    }
    setErrorField({});
    mutate();
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 flex-col justify-between mx-5 mt-1 mb-5">
        <View className="flex flex-col space-y-2">
          <InputWithError
            label="Description"
            onChangeText={(text) => setOrder({ ...order, description: text })}
            value={order.description}
            multiline={true}
          />
          <Text className="text-base font-medium">Department</Text>
          <Pressable
            className="flex flex-row items-center p-2.5 bg-gray-200"
            onPress={() => setProductModalVisible(true)}
          >
            <Text className="text-base">
              {order.product?.name ?? "Choose a product"}
            </Text>
            <View className="flex-1 flex flex-row justify-end mr-2">
              <AntDesign name="caretdown" size={9} color="dimgray" />
            </View>
          </Pressable>
          {errorField.product && (
            <Text className="text-sm text-red-500">{errorField.product}</Text>
          )}
          <Modal
            visible={isProductModalVisible}
            onRequestClose={() => setProductModalVisible(false)}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            <View className="flex-1 bg-white">
              <CustomHeader
                title="Select & Add Parts"
                onPressBack={() => setProductModalVisible(false)}
                searchBarEnabled={true}
                searchText={searchText}
                onChangeSearchText={(text) => setSearchText(text)}
              />
              <View className="mb-10">
                <ProductList
                  searchText={searchText}
                  componentOnPress={(product) => {
                    setOrder({ ...order, product: product });
                    setProductModalVisible(false);
                  }}
                  refresh={refresh}
                />
              </View>
            </View>
          </Modal>
          <Text className="text-base font-medium">Quantity</Text>
          <TextInput
            className="w-14 h-10 px-1 bg-gray-200 text-sm text-center"
            value={order.quantity.toString()}
            onChangeText={(text) => {
              const number = text.replace(/[^\d]/g, "");
              setOrder({ ...order, quantity: +number });
            }}
            onEndEditing={(e) => {
              if (+e.nativeEvent.text === 0) {
                setOrder({ ...order, quantity: 0 });
              }
            }}
            keyboardType="number-pad"
          />
          {errorField.quantity && (
            <Text className="text-sm text-red-500">{errorField.quantity}</Text>
          )}
          <Text className="text-base font-medium">Deadline Date</Text>
          <Pressable
            className="p-2.5 bg-gray-200"
            onPress={() => DateTimePickerAndroid.open({
                value: date,
                onChange: (event: DateTimePickerEvent, date: Date) => {
                  setDate(date);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  setOrder({
                    ...order,
                    deadlineDateTime: `${year}-${month}-${day} 00:00:00`,
                  });
                },
              })
            }
          >
            <Text className="text-base">
              {convertToDateString(order.deadlineDateTime) ?? "Select a Deadline Date"}
            </Text>
          </Pressable>
          {errorField.deadlineDateTime && (
            <Text className="text-sm text-red-500">{errorField.deadlineDateTime}</Text>
          )}
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
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateOrderPage;
