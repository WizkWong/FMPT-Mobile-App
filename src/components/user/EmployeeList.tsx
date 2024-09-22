import { View, Text, Pressable } from "react-native";
import { Avatar, Card, Icon } from "react-native-paper";
import { EmployeeTask } from "../../types/task";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const EmployeeList = ({
  employeeTaskList = [],
  allowRemove = false,
  removeFn = () => {},
}: {
  employeeTaskList: EmployeeTask[];
  allowRemove?: boolean;
  removeFn?: (employeeTask : EmployeeTask) => void;
}) => {
  return (
    <View className="space-y-3">
      {employeeTaskList.length !== 0 ? (
        employeeTaskList.map((employeeTask, index) => (
          <Card key={index}>
            <Card.Title
              className="py-2"
              title={employeeTask.employee.username}
              subtitle={
                <>
                  <Text className="text-xs">
                    Department: {employeeTask.employee.department ?? "-"}
                    {"\n"}
                  </Text>
                  {employeeTask.assignByManager && (
                    <Text className="text-xs leading-5">
                      Assign By Manager: {employeeTask.assignByManager.username ?? "-"}
                    </Text>
                  )}
                </>
              }
              subtitleNumberOfLines={3}
              left={(props) =>
                employeeTask.employee.image ? (
                  <Avatar.Image
                    {...props}
                    size={45}
                    source={{
                      uri: `data:image/jpg;base64,${employeeTask.employee.image}`,
                    }}
                  />
                ) : (
                  <Avatar.Icon
                    {...props}
                    className="bg-amber-500"
                    size={45}
                    color="white"
                    icon="account"
                  />
                )
              }
              right={() =>
                allowRemove && (
                  <Pressable onPress={() => removeFn(employeeTask)} className="pr-3">
                    <MaterialIcons name="delete" size={24} color="red" />
                  </Pressable>
                )
              }
            />
          </Card>
        ))
      ) : (
        <View>
          <Text className="mx-1 text-base">No Employees has assigned</Text>
        </View>
      )}
    </View>
  );
};

export default EmployeeList;
