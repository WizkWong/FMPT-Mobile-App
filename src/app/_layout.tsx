import React from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import config from "../constants/config";
import { PaperProvider } from "react-native-paper";

const queryClient = new QueryClient({});

const RootLayout = () => {
  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
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
            headerShown: false,
          }}
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="users" />
          <Stack.Screen name="department" />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
