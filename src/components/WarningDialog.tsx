import { View, Text } from "react-native";
import { Button, Dialog, IconButton, Portal } from "react-native-paper";

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
        <View className="flex flex-row justify-between items-center">
          <Dialog.Title className="text-lg font-bold text-red-500">
            Warning!
          </Dialog.Title>
          <IconButton
            className="mr-3"
            icon="close"
            size={24}
            onPress={() => onDismiss()}
          />
        </View>
        <Dialog.Content>
          <Text className="leading-normal">{children}</Text>
        </Dialog.Content>
        <Dialog.Actions className="space-x-2">
          <Button
            className="bg-amber-550 px-3"
            mode="contained"
            onPress={() => onDismiss()}
          >
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default WarningDialog;
