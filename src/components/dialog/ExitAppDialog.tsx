import { BackHandler, Text } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";

const ExitAppDialog = ({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => onDismiss()}>
        <Dialog.Title className="text-lg font-bold">Exit App</Dialog.Title>
        <Dialog.Content>
          <Text className="leading-normal">
            Do you want to exit the app?
          </Text>
        </Dialog.Content>
        <Dialog.Actions className="space-x-2">
          <Button
            className="px-1"
            textColor="#d97706"
            style={{ borderColor: "#d97706" }}
            mode="outlined"
            onPress={() => onDismiss()}
          >
            Cancel
          </Button>
          <Button
            className="bg-amber-550 px-3"
            mode="contained"
            onPress={() => BackHandler.exitApp()}
          >
            Exit
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ExitAppDialog;
