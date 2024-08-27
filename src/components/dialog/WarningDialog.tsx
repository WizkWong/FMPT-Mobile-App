import { Text } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";

const WarningDialog = ({
  visible,
  children,
  onDismiss,
}: {
  visible: boolean;
  children: string;
  onDismiss: () => void;
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => onDismiss()}>
        <Dialog.Title className="text-lg font-bold text-red-500">
          Warning!
        </Dialog.Title>
        <Dialog.Content>
          <Text className="leading-normal">{children}</Text>
        </Dialog.Content>
        <Dialog.Actions className="space-x-2">
          <Button
            className="bg-amber-550 px-3"
            mode="contained"
            onPress={() => onDismiss()}
          >
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default WarningDialog;
