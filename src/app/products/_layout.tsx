import React from "react";
import { Stack } from "expo-router";
import config from "../../constants/config";

const ProductLayout = () => {
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
      <Stack.Screen name="list" options={{ headerTitle: "Product Management" }} />
      <Stack.Screen name="[id]" options={{ headerTitle: "Product Details" }} />
      <Stack.Screen name="create" options={{ headerTitle: "Create Product" }} />
    </Stack>
  );
};

export default ProductLayout;
