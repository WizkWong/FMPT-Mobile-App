import { Link } from "expo-router";
import { View, Text } from "react-native";

const OrderSchedulePage = () => {
  return (
    <View>
      <Text>OrderSchedulePage</Text>
      <Link push href="/manager/order-schedule">Link</Link>
    </View>
  );
};

export default OrderSchedulePage;