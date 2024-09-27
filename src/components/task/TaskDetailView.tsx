import { View, Text } from "react-native";
import { Image } from "expo-image";
import { Card } from "react-native-paper";
import config from "../../constants/config";
import { Status } from "../../types/enum";
import EmployeeList from "../user/EmployeeList";
import { TaskDetail } from "../../types/task";

const TaskDetailView = ({ taskDetail }: { taskDetail: TaskDetail }) => {
  return (
    <View className="mx-4 my-2 space-y-3">
      <Card>
        <Card.Title
          title={`Task ID: ${taskDetail.task?.id ?? "-"}`}
          titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
        />
        <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
          <View className="flex flex-col space-y-2">
            <Text className="text-sm">
              Order ID: {taskDetail.task?.orderId ?? "-"}
            </Text>
            <Text className="text-sm">
              Assign Department: {taskDetail.task?.department ?? "-"}
            </Text>
            <Text className="text-sm">
              Status: {Status.toString(taskDetail.task?.status) ?? "-"}
            </Text>
            <Text className="text-sm">
              Start Date Time: {taskDetail.task?.startDateTime ?? "-"}
            </Text>
            <Text className="text-sm">
              Completed Date Time: {taskDetail.task?.completeDateTime ?? "-"}
            </Text>
          </View>
        </Card.Content>
      </Card>
      <Card>
        <Card.Title
          title={`Product: ${taskDetail.task?.product.name ?? "-"}`}
          titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
        />
        <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
          <View className="flex flex-col space-y-2">
            <View>
              <Text className="text-sm">Description:</Text>
              <Text className="text-sm">
                {taskDetail.task?.product.description ?? "-"}
              </Text>
            </View>
            <View>
              <Text className="text-sm">Image:</Text>
              {taskDetail.task?.product.image ? (
                <Image
                  className="h-48 w-48"
                  source={{
                    uri: `data:image/jpg;base64,${taskDetail.task.product.image}`,
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
          title={`Required Part: ${taskDetail.task?.part.name ?? "-"}`}
          titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
        />
        <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
          <View className="flex flex-col space-y-2">
            <Text className="text-sm">
              Grade: {taskDetail.task?.part.grade ?? "-"}
            </Text>
            <View>
              <Text className="text-sm">Nett Size:</Text>
              <Text className="text-sm">
                {taskDetail.task?.part.nettWidth == null &&
                taskDetail.task?.part.nettHeight == null &&
                taskDetail.task?.part.nettLength == null
                  ? "-"
                  : `${taskDetail.task?.part.nettWidth}${config.unitOfMeasurement} x ${taskDetail.task?.part.nettHeight}${config.unitOfMeasurement} x ${taskDetail.task?.part.nettLength}${config.unitOfMeasurement}`}
              </Text>
            </View>
            <View>
              <Text className="text-sm">Moulder Size:</Text>
              <Text className="text-sm">
                {taskDetail.task?.part.moulderWidth == null &&
                taskDetail.task?.part.moulderHeight == null &&
                taskDetail.task?.part.moulderLength == null
                  ? "-"
                  : `${taskDetail.task?.part.moulderWidth}${config.unitOfMeasurement} x ${taskDetail.task?.part.moulderHeight}${config.unitOfMeasurement} x ${taskDetail.task?.part.moulderLength}${config.unitOfMeasurement}`}
              </Text>
            </View>
            <Text className="text-sm">
              Target Quantity: {taskDetail.task?.targetQuantity ?? "-"}
            </Text>
            <View>
              <Text className="text-sm">Description:</Text>
              <Text className="text-sm">
                {taskDetail.task?.part.description ?? "-"}
              </Text>
            </View>
            <View>
              <Text className="text-sm">Image:</Text>
              {taskDetail.task?.part.image ? (
                <Image
                  className="h-48 w-48"
                  source={{
                    uri: `data:image/jpg;base64,${taskDetail.task.part.image}`,
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
            taskDetail.task?.partProcedure.stepNo ?? "-"
          } of Procedure`}
          titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
        />
        <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
          <View className="flex flex-col space-y-2">
            <View>
              <Text className="text-sm">Description:</Text>
              <Text className="text-sm">
                {taskDetail.task?.partProcedure.description ?? "-"}
              </Text>
            </View>
            <View>
              <Text className="text-sm">Attachment:</Text>
              {taskDetail.task?.partProcedure.attachment ? (
                <Image
                  className="h-48 w-48"
                  source={{
                    uri: `data:image/jpg;base64,${taskDetail.task.partProcedure.attachment}`,
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
          <EmployeeList employeeTaskList={taskDetail.employeeTask} />
        </Card.Content>
      </Card>
    </View>
  );
};

export default TaskDetailView;
