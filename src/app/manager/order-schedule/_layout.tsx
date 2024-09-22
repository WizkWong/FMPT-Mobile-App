import { Stack } from "expo-router";
import config from "../../../constants/config";

const OrderScheduleLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: config.colorTheme.header,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: "Order List" }} />
    </Stack>
  );
};

export default OrderScheduleLayout;