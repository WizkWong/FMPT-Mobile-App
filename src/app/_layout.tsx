import React from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";

const queryClient = new QueryClient({});

const RootLayout = () => {
  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#a6a22b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
          headerShown: false
        }}
      >
        <Stack.Screen name="login"/>
        <Stack.Screen name="admin" />
        <Stack.Screen name="users" />
      </Stack>
    </QueryClientProvider>
  );
};

export default RootLayout;
