import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DialogInput from "react-native-dialog-input";
import { AxiosError } from "axios";
import { createDepartment } from "../../services/UserService";

const CreateDepartmentDialog = ({
  isDialogVisible,
  setDialogVisible,
}: {
  isDialogVisible: Boolean;
  setDialogVisible: (value: React.SetStateAction<Boolean>) => void;
}) => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: (departmentName: string) => createDepartment(departmentName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchDepartmentList"] });
      setDialogVisible(false);
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      Alert.alert("Error", error.message, [{ text: "OK" }]);
    },
  });

  return (
    <DialogInput
      isDialogVisible={isDialogVisible}
      title={isPending ? "Creating Department..." : "Create Department"}
      message={
        isPending
          ? "Please wait for the moment"
          : "Please enter the department name:"
      }
      hintInput={"Department"}
      submitInput={(inputText) => {
        if (!isPending) {
          mutate(inputText);
        }
      }}
      closeDialog={() => setDialogVisible(false)}
    ></DialogInput>
  );
};

export default CreateDepartmentDialog;
