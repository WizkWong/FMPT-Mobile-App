import { View } from "react-native";
import {
  Button,
  Dialog,
  HelperText,
  IconButton,
  Portal,
  TextInput,
} from "react-native-paper";

const DepartmentDialog = ({
  title,
  visible,
  value,
  onChangeText,
  errorMsg,
  isLoading,
  onDismiss,
  onSubmit,
}: {
  title: string;
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  errorMsg: string;
  isLoading: boolean;
  onDismiss: () => void;
  onSubmit: () => void;
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => onDismiss()}>
        <View className="flex flex-row justify-between items-center">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          <IconButton icon="close" size={24} onPress={() => onDismiss()} />
        </View>
        <Dialog.Content>
          <TextInput
            label="Department"
            value={value}
            onChangeText={onChangeText}
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
            loading={isLoading}
            disabled={isLoading}
            onPress={() => onSubmit()}
          >
            Submit
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DepartmentDialog;
