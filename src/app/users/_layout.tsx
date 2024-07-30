import React from "react";
import { Stack } from "expo-router";

const UserLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#a6a22b",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="list" options={{ headerTitle: "User Management" }} />
      <Stack.Screen name="[id]" options={{ headerTitle: "User Profile" }} />
      <Stack.Screen name="create" options={{ headerTitle: "Create User" }} />
      <Stack.Screen name="update" options={{ headerTitle: "Change User Profile" }} />
    </Stack>
  );
};

export default UserLayout;
