import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import CustomError from "../../../components/CustomError";
import { Image } from "expo-image";
import { Card } from "react-native-paper";
import { getTaskById } from "../../../services/TaskService";
import config from "../../../constants/config";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Status } from "../../../types/enum";
import EmployeeList from "../../../components/user/EmployeeList";

const TaskDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError, error, isSuccess } = {
    ...useQuery({
      queryKey: ["fetchTask", id],
      queryFn: () => getTaskById(+id),
      refetchOnWindowFocus: "always",
    }),
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log(error);
    return <CustomError errorMsg={error.message} />;
  }

  if (isSuccess) {
    AsyncStorage.setItem(
      "employeeList",
      JSON.stringify(data?.data.employeeTask ?? [])
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <Pressable
                onPress={() => router.push(`/manager/task/assign?taskId=${id}&department=${data.data.task.department}`)}
              >
                <FontAwesome5 name="user-plus" size={24} color="white" />
              </Pressable>
            );
          },
        }}
      />
      <View className="mx-4 my-2 space-y-3">
        <Card>
          <Card.Title
            title={`Task ID: ${data?.data.task?.id ?? "-"}`}
            titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
          />
          <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
            <View className="flex flex-col space-y-2">
              <Text className="text-sm">
                Order ID: {data?.data.task?.orderId ?? "-"}
              </Text>
              <Text className="text-sm">
                Assign Department: {data?.data.task?.department ?? "-"}
              </Text>
              <Text className="text-sm">
                Status: {Status[data?.data.task?.status] ?? "-"}
              </Text>
              <Text className="text-sm">
                Start Date Time: {data?.data.task?.startDateTime ?? "-"}
              </Text>
              <Text className="text-sm">
                Completed Date Time: {data?.data.task?.completeDateTime ?? "-"}
              </Text>
            </View>
          </Card.Content>
        </Card>
        <Card>
          <Card.Title
            title={`Product: ${data?.data.task?.product.name ?? "-"}`}
            titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
          />
          <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
            <View className="flex flex-col space-y-2">
              <View>
                <Text className="text-sm">Description:</Text>
                <Text className="text-sm">
                  {data?.data.task?.product.description ?? "-"}
                </Text>
              </View>
              <View>
                <Text className="text-sm">Image:</Text>
                {data?.data.task?.product.image ? (
                  <Image
                    className="h-48 w-48"
                    source={{
                      uri: `data:image/jpg;base64,${data.data.task.product.image}`,
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
            title={`Required Part: ${data?.data.task?.part.name ?? "-"}`}
            titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
          />
          <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
            <View className="flex flex-col space-y-2">
              <Text className="text-sm">
                Grade: {data?.data.task?.part.grade ?? "-"}
              </Text>
              <View>
                <Text className="text-sm">Nett Size:</Text>
                <Text className="text-sm">
                  {data?.data.task?.part.nettWidth == null &&
                  data?.data.task?.part.nettHeight == null &&
                  data?.data.task?.part.nettLength == null
                    ? "-"
                    : `${data?.data.task?.part.nettWidth}${config.unitOfMeasurement} x ${data?.data.task?.part.nettHeight}${config.unitOfMeasurement} x ${data?.data.task?.part.nettLength}${config.unitOfMeasurement}`}
                </Text>
              </View>
              <View>
                <Text className="text-sm">Moulder Size:</Text>
                <Text className="text-sm">
                  {data?.data.task?.part.moulderWidth == null &&
                  data?.data.task?.part.moulderHeight == null &&
                  data?.data.task?.part.moulderLength == null
                    ? "-"
                    : `${data?.data.task?.part.moulderWidth}${config.unitOfMeasurement} x ${data?.data.task?.part.moulderHeight}${config.unitOfMeasurement} x ${data?.data.task?.part.moulderLength}${config.unitOfMeasurement}`}
                </Text>
              </View>
              <Text className="text-sm">
                Target Quantity: {data?.data.task?.targetQuantity ?? "-"}
              </Text>
              <View>
                <Text className="text-sm">Description:</Text>
                <Text className="text-sm">
                  {data?.data.task?.part.description ?? "-"}
                </Text>
              </View>
              <View>
                <Text className="text-sm">Image:</Text>
                {data?.data.task?.part.image ? (
                  <Image
                    className="h-48 w-48"
                    source={{
                      uri: `data:image/jpg;base64,${data.data.task.part.image}`,
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
              data?.data.task?.partProcedure.stepNo ?? "-"
            } of Procedure`}
            titleStyle={{ textAlignVertical: "center", marginVertical: 0 }}
          />
          <Card.Content className="pt-2 pb-3 border-t-1 border-gray-200">
            <View className="flex flex-col space-y-2">
              <View>
                <Text className="text-sm">Description:</Text>
                <Text className="text-sm">
                  {data?.data.task?.partProcedure.description ?? "-"}
                </Text>
              </View>
              <View>
                <Text className="text-sm">Attachment:</Text>
                {data?.data.task?.partProcedure.attachment ? (
                  <Image
                    className="h-48 w-48"
                    source={{
                      uri: `data:image/jpg;base64,${data.data.task.partProcedure.attachment}`,
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
            <EmployeeList employeeTaskList={data?.data.employeeTask} />
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default TaskDetailPage;
