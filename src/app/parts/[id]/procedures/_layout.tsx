import React from "react";
import { Stack } from "expo-router";
import config from "../../../../constants/config";

const PartProcedureLayout = () => {
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
      <Stack.Screen name="index" options={{ headerTitle: "Part Procedure" }} />
      <Stack.Screen name="[id]" options={{ headerTitle: "Part Procedure Details" }} />
      <Stack.Screen name="create" options={{ headerTitle: "Part Procedure" }} />
      <Stack.Screen name="update" options={{ headerTitle: "Change Part Procedure" }} />
    </Stack>
  );
};

export default PartProcedureLayout;
