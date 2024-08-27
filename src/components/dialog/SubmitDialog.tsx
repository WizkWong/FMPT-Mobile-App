import { Text } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";

const SubmitDialog = ({
  title,
  visible,
  children,
  loading,
  disabled,
  submitButtonText = "Yes",
  onDismiss,
  onPress,
}: {
  title: string;
  visible: boolean;
  children: string | string[];
  loading: boolean;
  disabled: boolean;
  submitButtonText?: string;
  onDismiss: () => void;
  onPress: () => void;
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => onDismiss()}>
        <Dialog.Title className="text-lg font-bold text-red-500">
          {title}
        </Dialog.Title>
        <Dialog.Content>
          <Text className="leading-normal">{children}</Text>
        </Dialog.Content>
        <Dialog.Actions className="space-x-2">
          <Button
            className="px-2"
            textColor="#d97706"
            style={{ borderColor: "#d97706" }}
            mode="outlined"
            onPress={() => onDismiss()}
          >
            Cancel
          </Button>
          <Button
            className="bg-amber-550 px-2"
            mode="contained"
            loading={loading}
            disabled={disabled}
            onPress={onPress}
          >
            {submitButtonText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default SubmitDialog;
