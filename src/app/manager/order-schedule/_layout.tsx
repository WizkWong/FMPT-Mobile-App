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
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default OrderScheduleLayout;
