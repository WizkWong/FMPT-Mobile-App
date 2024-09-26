import { StyleProp, StyleSheet, TextStyle } from "react-native";

const globalStyles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  lightShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  redText: {
    color: "red",
  },
  tabBar: {
    paddingVertical: 5,
    backgroundColor: "white",
    height: 60,
  },
});

export default globalStyles;
