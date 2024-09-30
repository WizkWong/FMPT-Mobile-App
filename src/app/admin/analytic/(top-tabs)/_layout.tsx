import { MaterialTopTabs } from "../../../../components/MaterialTopTabs";

const TaskListTabsLayout = () => {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { textTransform: "capitalize" },
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: "Dashboard",
        }}
      />
      <MaterialTopTabs.Screen
        name="employee"
        options={{
          title: "Employee Statistic",
        }}
      />
    </MaterialTopTabs>
  );
};

export default TaskListTabsLayout;
