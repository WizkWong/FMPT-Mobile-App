import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartment } from "../../services/UserService";
import { Department } from "../../types/user";
import { AxiosError } from "axios";
import SubmitDialog from "../dialog/SubmitDialog";

const DeleteDepartmentDialog = ({
  department,
  visible,
  onDismiss,
}: {
  department: Department;
  visible: boolean;
  onDismiss: () => void;
}) => {
  const queryClient = useQueryClient();

  const { isPending, mutate, error } = useMutation({
    mutationFn: () => deleteDepartment(department.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchDepartmentList"] });
      onDismiss();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      onDismiss();
      Alert.alert("Error!", error.response?.data?.message ?? error.message, [{ text: "Close" }]);
    },
  });

  return (
    <SubmitDialog
      title="Warning!"
      visible={visible}
      loading={isPending}
      disabled={isPending}
      submitButtonText="Delete"
      onDismiss={onDismiss}
      onPress={() => mutate()}
    >
      Are you sure you want to delete Deparment {department.name} ?
    </SubmitDialog>
  );
};

export default DeleteDepartmentDialog;
