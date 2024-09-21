import { Stack } from "expo-router";
import { View, Text } from "react-native";

const OrderSchedulePage = () => {
  return (
    <View>
      <Stack.Screen options={{ title: "Overview", headerShown: true }} />
      <Text>Order Schedule</Text>
    </View>
  );
};

export default OrderSchedulePage;
