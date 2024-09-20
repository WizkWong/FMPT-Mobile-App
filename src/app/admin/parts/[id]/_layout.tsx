import React from "react";
import { Stack } from "expo-router";
import config from "../../../../constants/config";

const PartDetailsLayout = () => {
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
      <Stack.Screen name="index" options={{ title: "Part Details" }} />
      <Stack.Screen name="procedures" options={{ headerShown: false }} />
    </Stack>
  );
};

export default PartDetailsLayout;
