import React from "react";
import { Stack } from "expo-router";
import config from "../../../constants/config";

const OrderLayout = () => {
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
      <Stack.Screen name="list" options={{ headerTitle: "Order" }} />
      <Stack.Screen name="[id]" options={{ headerTitle: "Order Details" }} />
      <Stack.Screen name="create" options={{ headerTitle: "Create Order" }} />
      <Stack.Screen name="schedule" options={{ headerTitle: "Order Schedule" }} />
    </Stack>
  );
};

export default OrderLayout;
