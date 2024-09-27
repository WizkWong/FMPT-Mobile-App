import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import CustomError from "../../../components/CustomError";
import { getTaskById, patchTask } from "../../../services/TaskService";
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
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <TaskDetailView taskDetail={data?.data} />
      {(data?.data.task.status === Status.NOT_STARTED ||
        data?.data.task.status === Status.IN_PROGRESS ) && (
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
            ? "Accept Task"
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
