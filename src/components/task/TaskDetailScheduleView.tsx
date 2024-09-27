import { ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import CustomError from "../../components/CustomError";
import { getTaskById } from "../../services/TaskService";
import TaskDetailView from "../../components/task/TaskDetailView";

const TaskDetailScheduleView = ({ taskId }: { taskId: number }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetchTask", taskId],
    queryFn: () => getTaskById(taskId),
    refetchOnWindowFocus: "always",
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log(error);
    return <CustomError errorMsg={error.message} />;
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <TaskDetailView taskDetail={data?.data} />
    </ScrollView>
  );
};

export default TaskDetailScheduleView;
