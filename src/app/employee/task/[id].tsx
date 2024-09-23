import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import CustomError from "../../../components/CustomError";
import { getTaskById } from "../../../services/TaskService";
import TaskDetailsView from "../../../components/task/TaskDetailsView";

const TaskDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError, error } = {
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

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <TaskDetailsView taskDetails={data?.data} />
    </ScrollView>
  );
};

export default TaskDetailPage;
