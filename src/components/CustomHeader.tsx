import { View, Text, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const CustomHeader = ({
  title,
  onPressBack,
  children,
}: {
  title: string;
  onPressBack: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <View className="flex flex-row items-center p-4 bg-header-theme">
      <Pressable onPress={onPressBack}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>
      <Text className="text-xl text-white font-bold ml-5">{title}</Text>
      {children && (
        <View className="flex-1 flex flex-row justify-end">{children}</View>
      )}
    </View>
  );
};

export default CustomHeader;
