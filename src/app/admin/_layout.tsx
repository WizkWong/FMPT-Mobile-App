import React from "react";
import { Stack } from "expo-router";
import config from "../../constants/config";

const AdminLayout = () => {
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
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="department" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="parts" />
      <Stack.Screen name="products" />
      <Stack.Screen name="users" />
    </Stack>
  );
};

export default AdminLayout;
