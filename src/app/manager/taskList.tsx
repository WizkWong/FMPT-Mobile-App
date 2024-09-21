import { Link } from "expo-router";
import { View, Text } from "react-native";

const TaskListPage = () => {
  return (
    <View>
      <Text>TaskList</Text>
      <Link push href="/manager/task">Link</Link>
    </View>
  );
};

export default TaskListPage;