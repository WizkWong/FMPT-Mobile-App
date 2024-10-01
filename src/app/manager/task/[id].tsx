import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, Pressable } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import CustomError from "../../../components/CustomError";
import { getTaskById, patchTask } from "../../../services/TaskService";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskDetailView from "../../../components/task/TaskDetailView";
import { Button } from "react-native-paper";
import { useState } from "react";
import SuccessDialog from "../../../components/dialog/SuccessDialog";
import ErrorDialog from "../../../components/dialog/ErrorDialog";
import { AxiosError } from "axios";
import { Status } from "../../../types/enum";
import { Task } from "../../../types/task";

const TaskDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isSuccessDialogVisible, setSuccessDialogVisible] = useState(false);
  const [isErrorDialogVisible, setErrorDialogVisible] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["fetchTask", id],
    queryFn: () => getTaskById(+id),
    refetchOnWindowFocus: "always",
  });

  const {
    isPending,
    mutate,
    error: mutateError,
  } = useMutation<any, AxiosError<{ message: string }>, Task>({
    mutationFn: (task) => patchTask(+id, task),
    onSuccess: () => {
      setSuccessDialogVisible(true);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["fetchOrderList"] });
      queryClient.invalidateQueries({ queryKey: ["fetchTaskList"] });
    },
    onError: () => {
      setErrorDialogVisible(true);
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log(error);
    return <CustomError errorMsg={error.message} />;
  }

  const handleClick = () => {
    if (data?.data.task.status === Status.NOT_STARTED) {
      mutate({ status: Status.IN_PROGRESS });
      return;
    }
    mutate({ status: Status.COMPLETED });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {data?.data.task.status !== Status.COMPLETED && (
        <Stack.Screen
          options={{
            headerRight: () => {
              return (
                <Pressable
                  onPress={() => {
                    AsyncStorage.setItem(
                      "employeeList",
                      JSON.stringify(data?.data.employeeTask ?? [])
                    );
                    router.push(`/manager/task/assign?taskId=${id}&department=${data.data.task.department}`)
                  }}
                >
                  <FontAwesome5 name="user-plus" size={24} color="white" />
                </Pressable>
              );
            },
          }}
        />
      )}
      <TaskDetailView taskDetail={data?.data} />
      {data?.data.employeeTask.length !== 0 &&
        (data?.data.task.status === Status.NOT_STARTED ||
          data?.data.task.status === Status.IN_PROGRESS) && (
          <Button
            mode="contained-tonal"
            className="mx-4 my-3 bg-amber-550 rounded font-bold"
            textColor="white"
            labelStyle={{ fontWeight: "bold" }}
            onPress={handleClick}
            loading={isPending}
            disabled={isPending}
          >
            {data?.data.task.status === Status.NOT_STARTED
              ? "Start Task"
              : "Complete Task"}
          </Button>
        )}
      <SuccessDialog
        title="Success"
        visible={isSuccessDialogVisible}
        onDismiss={() => setSuccessDialogVisible(false)}
      >
        Successfully update the task.
      </SuccessDialog>
      <ErrorDialog
        visible={isErrorDialogVisible}
        onDismiss={() => setErrorDialogVisible(false)}
      >
        {mutateError?.response?.data.message ?? mutateError?.message ?? ""}
      </ErrorDialog>
    </ScrollView>
  );
};

export default TaskDetailPage;
