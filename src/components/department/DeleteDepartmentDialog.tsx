import { Text } from "react-native";
import { useState } from "react";
import { Button, Dialog, Portal } from "react-native-paper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartment } from "../../services/UserService";
import { Department } from "../../types/user";
import { AxiosError } from "axios";
import ErrorDialog from "../dialog/ErrorDialog";

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
  const [isErrorDialogVisible, setErrorDialogVisible] = useState(false);

  const { isPending, mutate, error } = useMutation({
    mutationFn: () => deleteDepartment(department.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchDepartmentList"] });
      onDismiss();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      onDismiss();
      setErrorDialogVisible(true);
    },
  });

  return (
    <>
      <Portal>
        <Dialog visible={visible} onDismiss={() => onDismiss()}>
          <Dialog.Title className="text-lg font-bold text-red-500">
            Warning!
          </Dialog.Title>
          <Dialog.Content>
            <Text className="leading-normal">
              Are you sure you want to delete Deparment {department.name} ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions className="space-x-2">
            <Button
              className="bg-amber-550 px-1"
              mode="contained"
              onPress={() => onDismiss()}
            >
              Cancel
            </Button>
            <Button
              className="px-1"
              textColor="#d97706"
              style={{ borderColor: "#d97706" }}
              mode="outlined"
              loading={isPending}
              disabled={isPending}
              onPress={() => mutate()}
            >
              Comfirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ErrorDialog
        visible={isErrorDialogVisible}
        onDismiss={() => setErrorDialogVisible(false)}
      >
        {error?.response?.data?.message}
      </ErrorDialog>
    </>
  );
};

export default DeleteDepartmentDialog;
