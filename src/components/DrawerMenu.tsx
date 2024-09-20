import { useState } from "react";
import { Drawer } from "react-native-paper";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

const DrawerMenu = () => {
  const [active, setActive] = useState("");

  return (
    <Drawer.Section title="Some title">
      <Drawer.Item
        label="User"
        icon={() => <FontAwesome5 name="user-alt" size={24} color="black" />}
        active={active === "User"}
        onPress={() => {
          setActive("User");
          router.push("/users/list");
        }}
      />
      <Drawer.Item
        label="Department"
        icon={() => <MaterialIcons name="groups" size={36} color="black" />}
        active={active === "Department"}
        onPress={() => {
          setActive("Department");
          router.push("/department");
        }}
      />
      <Drawer.Item
        label="Product"
        icon={() => (
          <MaterialCommunityIcons name="table-chair" size={36} color="black" />
        )}
        active={active === "Product"}
        onPress={() => {
          setActive("Product");
          router.push("/products/list");
        }}
      />
      <Drawer.Item
        label="Product Part"
        icon={() => (
          <MaterialCommunityIcons name="ruler-square" size={36} color="black" />
        )}
        active={active === "Product Part"}
        onPress={() => {
          setActive("Product Part");
          router.push("/parts/list");
        }}
      />
      <Drawer.Item
        label="Order"
        icon={() => (
          <FontAwesome5 name="clipboard-list" size={36} color="black" />
        )}
        active={active === "Order"}
        onPress={() => {
          setActive("Order");
          router.push("/orders/list");
        }}
      />
    </Drawer.Section>
  );
};

export default DrawerMenu;
