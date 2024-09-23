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
      <Stack.Screen name="index" options={{ headerTitle: "Task List" }} />
      <Stack.Screen name="[id]" options={{ headerTitle: "Task Details" }} />
    </Stack>
  );
};

export default TaskLayout;