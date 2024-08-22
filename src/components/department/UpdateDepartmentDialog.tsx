import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { updateDepartment } from "../../services/UserService";
import { useEffect, useState } from "react";
import DepartmentDialog from "./DepartmentDialog";
import { Department } from "../../types/user";

const UpdateDepartmentDialog = ({
  department,
  visible,
  onDismiss,
}: {
  department: Department
  visible: boolean;
  onDismiss: () => void;
}) => {
  const queryClient = useQueryClient();
  const [departmentInput, setDepartmentInput] = useState<Department>(department);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setDepartmentInput(department);
  }, [department])

  const closeDialog = () => {
    setDepartmentInput(department);
    setErrorMsg("");
    onDismiss();
  };

  const { isPending, mutate } = useMutation({
    mutationFn: () => updateDepartment(departmentInput),
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
    if (!departmentInput.name) {
      setErrorMsg("Department cannot be empty!");
      return;
    }
    if (departmentInput.name === department.name) {
      closeDialog();
      return;
    }
    mutate();
  };

  return (
    <DepartmentDialog
      title="Modify Department"
      visible={visible}
      value={departmentInput.name}
      onChangeText={(text) => setDepartmentInput({...department, name: text})}
      errorMsg={errorMsg}
      isLoading={isPending}
      onDismiss={closeDialog}
      onSubmit={onSubmit}
    />
  );
};

export default UpdateDepartmentDialog;
