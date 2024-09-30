import { Stack } from "expo-router";
import config from "../../../constants/config";

const ReportLayout = () => {
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
      <Stack.Screen name="(top-tabs)" options={{ headerTitle: "Analytic" }} />
    </Stack>
  );
};

export default ReportLayout;
