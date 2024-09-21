import config from "../../constants/config";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

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
        },
        headerTitleAlign: 'center',
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingVertical: 5,
          backgroundColor: "white",
          height: 60,
        },
        tabBarLabelStyle: { paddingBottom: 5 },
      }}
    >
      <Tabs.Screen
        name="taskList"
        options={{
          title: "Task",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="tasks" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orderScheduleList"
        options={{
          title: "Order Schedule",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="schedule" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytic"
        options={{
          title: "Analytic",
          tabBarIcon: ({ color }) => (
            <Ionicons name="analytics" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="order-schedule"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default ManagerLayout;
