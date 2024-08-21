import {
  Text,
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Menu, IconButton } from "react-native-paper";
import globalStyles from "../constants/globalStyles";

type ItemMenu = {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  titleStyle?: StyleProp<TextStyle>;
};

const ItemMenu = ({
  title,
  onPress,
  itemMenu,
}: {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  itemMenu: ItemMenu[];
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Pressable
      style={globalStyles.shadow}
      className="flex flex-row m-1 p-1 bg-white rounded"
      onPress={onPress}
    >
      <Text className="flex-1 self-center ml-2 text-2xl">{title}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <IconButton
            icon="dots-vertical"
            onPress={() => setVisible(true)}
          ></IconButton>
        }
        anchorPosition="bottom"
      >
        {itemMenu.map((item, index) => (
          <Menu.Item
            key={index}
            title={item.title}
            titleStyle={item.titleStyle}
            onPress={item.onPress}
          />
        ))}
      </Menu>
    </Pressable>
  );
};

export default ItemMenu;
