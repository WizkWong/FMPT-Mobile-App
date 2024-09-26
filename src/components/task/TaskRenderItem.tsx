import { View, Image, Text } from "react-native";
import { Avatar, Card, Icon } from "react-native-paper";
import { Task } from "../../types/task";
import { Status } from "../../types/enum";
import config from "../../constants/config";

const TaskRenderItem = ({ task, componentOnPress }: { task: Task, componentOnPress: (task: Task) => void }) => {
  const nettSize =
    task.part.nettWidth == null &&
    task.part.nettHeight == null &&
    task.part.nettLength == null
      ? "-"
      : `${task.part.nettWidth}${config.unitOfMeasurement} x ${task.part.nettHeight}${config.unitOfMeasurement} x ${task.part.nettLength}${config.unitOfMeasurement}`;

  return (
    <Card className="mx-4 my-2" onPress={() => componentOnPress(task)}>
      <Card.Title
        className="py-2"
        title={<Text className="font-semibold">{task.part.name}</Text>}
        titleStyle={{ fontSize: 15 }}
        subtitle={
          <>
            <Text className="text-gray-500 font-bold">Grade: </Text>
            <Text>
              {task.part.grade}
              {"\n"}
            </Text>
            <Text className="text-gray-500 font-bold">Nett Size:{"\n"}</Text>
            <Text>
              {nettSize}
              {"\n"}
            </Text>
            <Text className="text-gray-500 font-bold">Quantity: </Text>
            <Text>
              {task.targetQuantity}
              {"\n"}
            </Text>
            <Text className="text-gray-500 font-bold">Status: </Text>
            <Text
              className={`font-semibold ${
                task.status === Status.COMPLETED
                  ? "text-green-600"
                  : task.status === Status.IN_PROGRESS
                  ? "text-blue-500"
                  : task.status === Status.PENDING
                  ? "text-yellow-600"
                  : task.status === Status.CANCELLED
                  ? "text-red-500"
                  : "text-gray-700"
              }`}
            >
              {Status.toString(task.status)}
            </Text>
          </>
        }
        subtitleNumberOfLines={6}
        subtitleStyle={{ fontSize: 12, color: "#4b5563" }}
        left={(props) =>
          task.part.image ? (
            <Image
              className="h-11 w-11"
              source={{
                uri: `data:image/jpg;base64,${task.part.image}`,
              }}
            />
          ) : (
            <Avatar.Icon
              className="rounded-none bg-amber-500"
              {...props}
              color="white"
              size={45}
              icon="image-off-outline"
            />
          )
        }
        right={(props) => (
          <View className="pr-3">
            <Icon {...props} source="chevron-right" />
          </View>
        )}
      />
      <Card.Content className="py-2 border-t-1 border-gray-200">
        <Text className="text-sm font-semibold pb-2">{task.product.name}</Text>
        <View className="flex flex-row space-x-2 items-center py-1">
          {task.product.image ? (
            <Image
              className="h-11 w-11"
              source={{
                uri: `data:image/jpg;base64,${task.product.image}`,
              }}
            />
          ) : (
            <Avatar.Icon
              className="rounded-none bg-amber-500"
              color="white"
              size={45}
              icon="image-off-outline"
            />
          )}
          <View className="flex flex-col space-y-1">
            <Text>
              <Text className="text-xs text-gray-500 font-bold">Task ID: </Text>
              <Text className="text-xs font-normal text-gray-700">
                {task.id}
              </Text>
            </Text>
            <Text>
              <Text className="text-xs text-gray-500 font-bold">
                Order ID:{" "}
              </Text>
              <Text className="text-xs font-normal text-gray-700">
                {task.orderId}
              </Text>
            </Text>
            <Text>
              <Text className="text-xs text-gray-500 font-bold">
                Department:{" "}
              </Text>
              <Text className="text-xs font-normal text-gray-700">
                {task.department}
              </Text>
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default TaskRenderItem;