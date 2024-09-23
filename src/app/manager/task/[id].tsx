import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import CustomError from "../../../components/CustomError";
import { getTaskById } from "../../../services/TaskService";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskDetailsView from "../../../components/task/TaskDetailsView";

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
      <TaskDetailsView taskDetails={data?.data} />
    </ScrollView>
  );
};

export default TaskDetailPage;
