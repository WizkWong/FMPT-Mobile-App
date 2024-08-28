import {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Menu, IconButton } from "react-native-paper";
import globalStyles from "../constants/globalStyles";

type Item = {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  titleStyle?: StyleProp<TextStyle>;
};

const ItemMenu = ({
  onPress,
  item,
  children,
}: {
  onPress: (e: GestureResponderEvent) => void;
  item: Item[];
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
    </Pressable>
  );
};

export default ItemMenu;
