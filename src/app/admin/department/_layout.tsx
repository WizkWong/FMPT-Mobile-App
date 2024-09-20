import React from "react";
import { Stack } from "expo-router";
import config from "../../../constants/config";

const DepartmentLayout = () => {
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
      <Stack.Screen name="index" options={{ headerTitle: "Department" }} />
    </Stack>
  );
};

export default DepartmentLayout;
