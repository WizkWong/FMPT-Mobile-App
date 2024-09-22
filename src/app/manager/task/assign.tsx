import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native'

const AssignEmployeePage = () => {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();

  return (
    <View>
      <Text>Employee</Text>
    </View>
  )
}

export default AssignEmployeePage