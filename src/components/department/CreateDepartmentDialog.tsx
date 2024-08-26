import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createDepartment } from "../../services/UserService";
import { useState } from "react";
import DepartmentDialog from "./DepartmentDialog";

const CreateDepartmentDialog = ({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) => {
  const queryClient = useQueryClient();
  const [departmentInput, setDepartmentInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const closeDialog = () => {
    setDepartmentInput("");
    setErrorMsg("");
    onDismiss();
  };

  const { isPending, mutate } = useMutation({
    mutationFn: () => createDepartment(departmentInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchDepartmentList"] });
      closeDialog();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      setErrorMsg(error.response.data?.message);
    },
  });

  const onSubmit = () => {
    if (!departmentInput) {
      setErrorMsg("Department cannot be empty!");
      return;
    }
    mutate();
  };

  return (
    <DepartmentDialog
      title="Create Department"
      visible={visible}
      value={departmentInput}
      onChangeText={(text) => setDepartmentInput(text)}
      errorMsg={errorMsg}
      isLoading={isPending}
      onDismiss={closeDialog}
      onSubmitText="Create"
      onSubmit={onSubmit}
    />
  );
};

export default CreateDepartmentDialog;
