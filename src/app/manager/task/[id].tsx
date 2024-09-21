import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const TaskListPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <View>
      <Text>TaskList</Text>
      <Text>{id}</Text>
    </View>
  );
};

export default TaskListPage;
