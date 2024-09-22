import { View, Text } from "react-native";
import { User } from "../../types/user";
import { Avatar, Card, Icon } from "react-native-paper";

const EmployeeList = ({
  employeeList = [],
  assignByManager,
}: {
  employeeList: User[];
  assignByManager: User;
}) => {
  return (
    <View>
      {employeeList.length !== 0 ? (
        employeeList.map((employee, index) => (
          <Card key={index} className="mx-4 my-2 pr-3">
            <Card.Title
              className="py-2"
              title={employee.username}
              subtitle={
                <>
                  <Text>Department: ${employee.department ?? "-"}{"\n"}</Text>
                  {assignByManager && <Text>Assign By Manager: ${assignByManager.username ?? "-"}</Text>}
                </>
              }
              subtitleNumberOfLines={2}
              left={(props) =>
                employee.image ? (
                  <Avatar.Image
                    {...props}
                    size={45}
                    source={{ uri: `data:image/jpg;base64,${employee.image}` }}
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
              right={(props) => <Icon {...props} source="chevron-right" />}
            />
          </Card>
        ))
      ) : (
        <View>
          <Text className="text-base">No Employees has assigned</Text>
        </View>
      )}
    </View>
  );
};

export default EmployeeList;
