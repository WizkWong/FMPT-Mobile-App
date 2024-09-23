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
    <Card
      className="mx-4 my-2"
      onPress={() => componentOnPress(task)}
    >
      <Card.Title
        className="py-2"
        title={`Task ID: ${task.id}`}
        subtitle={
          <>
            <Text>Order ID: {task.orderId}{"\n"}</Text>
            <Text>Product: {task.product.name}{"\n"}</Text>
            <Text>Department: {task.department}{"\n"}</Text>
            <Text>Status: {Status.toString(task.status)}</Text>
          </>
        }
        subtitleNumberOfLines={6}
        subtitleStyle={{ fontSize: 14 }}
        left={(props) =>
          task.product.image ? (
            <Image
              className="h-11 w-11"
              source={{
                uri: `data:image/jpg;base64,${task.product.image}`,
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
        <Text className="text-base">{task.part.name}</Text>
        <View className="flex flex-row space-x-2 items-center py-1">
          {task.part.image ? (
            <Image
              className="h-11 w-11"
              source={{
                uri: `data:image/jpg;base64,${task.part.image}`,
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
            <Text>Grade: {task.part.grade}</Text>
            <Text>Nett Size:</Text>
            <Text>{nettSize}</Text>
            <Text>Quantity: {task.targetQuantity}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default TaskRenderItem;