import {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Menu } from "react-native-paper";
import { Icon } from "react-native-paper";

type Item = {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  titleStyle?: StyleProp<TextStyle>;
};

const ItemMenu = ({
  item,
}: {
  item: Item[];
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Pressable onPress={() => setVisible(true)}>
          <Icon source="dots-vertical" size={24}></Icon>
        </Pressable>
      }
      anchorPosition="bottom"
    >
      {item.map((item, index) => (
        <Menu.Item
          key={index}
          title={item.title}
          titleStyle={item.titleStyle}
          onPress={(e) => {
            setVisible(false);
            item.onPress(e);
          }}
        />
      ))}
    </Menu>
  );
};

export default ItemMenu;
