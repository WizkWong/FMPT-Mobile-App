import { View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createDepartment } from "../../services/UserService";
import {
  Button,
  Dialog,
  HelperText,
  IconButton,
  Portal,
  TextInput,
} from "react-native-paper";
import { useState } from "react";

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

  const submit = () => {
    if (!departmentInput) {
      setErrorMsg("Department cannot be empty!");
      return;
    }
    mutate();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => closeDialog()}>
        <View className="flex flex-row justify-between items-center">
          <Dialog.Title className="text-lg font-bold">
            Create Department
          </Dialog.Title>
          <IconButton icon="close" size={24} onPress={() => closeDialog()} />
        </View>
        <Dialog.Content>
          <TextInput
            label="Department"
            value={departmentInput}
            onChangeText={(text) => setDepartmentInput(text)}
            underlineColor="transparent"
          />
          <HelperText type="error" visible={errorMsg.length !== 0}>
            {errorMsg}
          </HelperText>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            className="bg-amber-550 px-1"
            mode="contained"
            loading={isPending}
            disabled={isPending}
            onPress={() => submit()}
          >
            Submit
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CreateDepartmentDialog;
