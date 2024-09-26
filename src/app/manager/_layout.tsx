import config from "../../constants/config";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import globalStyles from "../../constants/globalStyles";

const ManagerLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: config.colorTheme.header,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          marginLeft: 10,
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: globalStyles.tabBar,
        tabBarLabelStyle: { paddingBottom: 5 },
      }}
    >
      <Tabs.Screen
        name="task"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="tasks" size={28} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="order-schedule"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="schedule" size={28} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="analytic"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="analytics" size={28} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={28} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default ManagerLayout;
