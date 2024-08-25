import {
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
  onPress,
  itemMenu,
  children,
}: {
  onPress: (e: GestureResponderEvent) => void;
  itemMenu: ItemMenu[];
  children?: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Pressable
      style={globalStyles.shadow}
      className="flex flex-row m-1 p-1 bg-white rounded"
      onPress={onPress}
    >
      {children}
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
            onPress={(e) => {
              setVisible(false);
              item.onPress(e);
            }}
          />
        ))}
      </Menu>
    </Pressable>
  );
};

export default ItemMenu;
