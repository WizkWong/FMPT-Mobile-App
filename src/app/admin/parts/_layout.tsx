import React from "react";
import { Stack } from "expo-router";
import config from "../../../constants/config";

const PartLayout = () => {
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
      <Stack.Screen name="list" options={{ headerTitle: "Part" }} />
      <Stack.Screen name="create" options={{ headerTitle: "Create Part" }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default PartLayout;
