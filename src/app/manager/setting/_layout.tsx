import { Stack } from "expo-router";
import config from "../../../constants/config";

const TaskLayout = () => {
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
      <Stack.Screen name="index" options={{ headerTitle: "Settings", headerTitleAlign: "center" }} />
    </Stack>
  );
};

export default TaskLayout;
