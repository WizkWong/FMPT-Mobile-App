import { View, Text } from "react-native";
import { Image } from "expo-image";
import { Card } from "react-native-paper";
import config from "../../constants/config";
import { Status } from "../../types/enum";
import EmployeeList from "../user/EmployeeList";
import { TaskDetail } from "../../types/task";

const TaskDetailsView = ({ taskDetails }: { taskDetails: TaskDetail }) => {
  return (
    <View className="mx-4 my-2 space-y-3">
      <Card>
        <Card.Title
          title={`Task ID: ${taskDetails.task?.id ?? "-"}`}
          titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
        />
        <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
          <View className="flex flex-col space-y-2">
            <Text className="text-sm">
              Order ID: {taskDetails.task?.orderId ?? "-"}
            </Text>
            <Text className="text-sm">
              Assign Department: {taskDetails.task?.department ?? "-"}
            </Text>
            <Text className="text-sm">
              Status: {Status.toString(taskDetails.task?.status) ?? "-"}
            </Text>
            <Text className="text-sm">
              Start Date Time: {taskDetails.task?.startDateTime ?? "-"}
            </Text>
            <Text className="text-sm">
              Completed Date Time: {taskDetails.task?.completeDateTime ?? "-"}
            </Text>
          </View>
        </Card.Content>
      </Card>
      <Card>
        <Card.Title
          title={`Product: ${taskDetails.task?.product.name ?? "-"}`}
          titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
        />
        <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
          <View className="flex flex-col space-y-2">
            <View>
              <Text className="text-sm">Description:</Text>
              <Text className="text-sm">
                {taskDetails.task?.product.description ?? "-"}
              </Text>
            </View>
            <View>
              <Text className="text-sm">Image:</Text>
              {taskDetails.task?.product.image ? (
                <Image
                  className="h-48 w-48"
                  source={{
                    uri: `data:image/jpg;base64,${taskDetails.task.product.image}`,
                  }}
                />
              ) : (
                <Text className="text-sm">No Image</Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
      <Card>
        <Card.Title
          title={`Required Part: ${taskDetails.task?.part.name ?? "-"}`}
          titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
        />
        <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
          <View className="flex flex-col space-y-2">
            <Text className="text-sm">
              Grade: {taskDetails.task?.part.grade ?? "-"}
            </Text>
            <View>
              <Text className="text-sm">Nett Size:</Text>
              <Text className="text-sm">
                {taskDetails.task?.part.nettWidth == null &&
                taskDetails.task?.part.nettHeight == null &&
                taskDetails.task?.part.nettLength == null
                  ? "-"
                  : `${taskDetails.task?.part.nettWidth}${config.unitOfMeasurement} x ${taskDetails.task?.part.nettHeight}${config.unitOfMeasurement} x ${taskDetails.task?.part.nettLength}${config.unitOfMeasurement}`}
              </Text>
            </View>
            <View>
              <Text className="text-sm">Moulder Size:</Text>
              <Text className="text-sm">
                {taskDetails.task?.part.moulderWidth == null &&
                taskDetails.task?.part.moulderHeight == null &&
                taskDetails.task?.part.moulderLength == null
                  ? "-"
                  : `${taskDetails.task?.part.moulderWidth}${config.unitOfMeasurement} x ${taskDetails.task?.part.moulderHeight}${config.unitOfMeasurement} x ${taskDetails.task?.part.moulderLength}${config.unitOfMeasurement}`}
              </Text>
            </View>
            <Text className="text-sm">
              Target Quantity: {taskDetails.task?.targetQuantity ?? "-"}
            </Text>
            <View>
              <Text className="text-sm">Description:</Text>
              <Text className="text-sm">
                {taskDetails.task?.part.description ?? "-"}
              </Text>
            </View>
            <View>
              <Text className="text-sm">Image:</Text>
              {taskDetails.task?.part.image ? (
                <Image
                  className="h-48 w-48"
                  source={{
                    uri: `data:image/jpg;base64,${taskDetails.task.part.image}`,
                  }}
                />
              ) : (
                <Text className="text-sm">No Image</Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
      <Card>
        <Card.Title
          title={`Step ${
            taskDetails.task?.partProcedure.stepNo ?? "-"
          } of Procedure`}
          titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
        />
        <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
          <View className="flex flex-col space-y-2">
            <View>
              <Text className="text-sm">Description:</Text>
              <Text className="text-sm">
                {taskDetails.task?.partProcedure.description ?? "-"}
              </Text>
            </View>
            <View>
              <Text className="text-sm">Attachment:</Text>
              {taskDetails.task?.partProcedure.attachment ? (
                <Image
                  className="h-48 w-48"
                  source={{
                    uri: `data:image/jpg;base64,${taskDetails.task.partProcedure.attachment}`,
                  }}
                />
              ) : (
                <Text className="text-sm">No Attachment</Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
      <Card>
        <Card.Title
          title="Assign Employees"
          titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
        />
        <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
          <EmployeeList employeeTaskList={taskDetails.employeeTask} />
        </Card.Content>
      </Card>
    </View>
  );
};

export default TaskDetailsView;
