import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialTopTabs } from "../../../../components/MaterialTopTabs";
import { View, Text } from "react-native";

const TaskListTabsLayout = () => {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: "Active",
          tabBarLabel: ({ color, children }) => (
            <View className="flex-row items-center">
              <FontAwesome5 name="check-circle" size={24} color={color} />
              <Text className="ml-3" style={{ color: color }}>{children}</Text>
            </View>
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarLabel: ({ color, children }) => (
            <View className="flex-row items-center">
              <MaterialIcons name="schedule" size={24} color={color} />
              <Text className="ml-3" style={{ color: color }}>{children}</Text>
            </View>
          ),
        }}
      />
    </MaterialTopTabs>
  );
};

export default TaskListTabsLayout;
