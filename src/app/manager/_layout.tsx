import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import globalStyles from "../../constants/globalStyles";

const ManagerLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: globalStyles.tabBar,
        tabBarLabelStyle: { paddingBottom: 5 },
      }}
    >
      <Tabs.Screen
        name="task"
        options={{
          tabBarLabel: "Task",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="tasks" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="order-schedule"
        options={{
          tabBarLabel: "Order Schedule",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="schedule" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytic"
        options={{
          tabBarLabel: "Analytic",
          tabBarIcon: ({ color }) => (
            <Ionicons name="analytics" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: "Setting",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default ManagerLayout;
