import React from "react";
import { Stack } from "expo-router";
import config from "../../constants/config";

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
      <Stack.Screen name="list" options={{ headerTitle: "Part Management" }} />
      <Stack.Screen name="[id]" options={{ headerTitle: "Part Details" }} />
      <Stack.Screen name="create" options={{ headerTitle: "Create Part" }} />
    </Stack>
  );
};

export default PartLayout;
