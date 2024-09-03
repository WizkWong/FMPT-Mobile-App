import { View, Text, Pressable, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const CustomHeader = ({
  title,
  onPressBack,
  searchBarEnabled = false,
  searchText = "",
  onChangeSearchText = () => {},
  children,
}: {
  title: string;
  onPressBack: () => void;
  searchBarEnabled?: boolean;
  searchText?: string;
  onChangeSearchText?: (query: string) => void;
  children?: React.ReactNode;
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    if (searchText.length !== 0) {
      onChangeSearchText("");
      return;
    }
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <View className="flex flex-row items-center p-4 bg-header-theme">
      <Pressable onPress={onPressBack}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </Pressable>
      {!isSearchOpen ? (
        <>
          <Text className="text-xl text-white font-bold ml-5">{title}</Text>
          {searchBarEnabled ? (
            <View className="flex-1 flex flex-row justify-end items-center">
              <Pressable onPress={toggleSearch} className="ml-4">
                <MaterialIcons name="search" size={22} color="darkslategray" />
              </Pressable>
              {children}
            </View>
          ) : (
            <View className="flex-1 flex flex-row justify-end items-center">
              {children}
            </View>
          )}
        </>
      ) : (
        <>
          <TextInput
            value={searchText}
            onChangeText={onChangeSearchText}
            placeholder="Search..."
            className="mx-4 px-1 text-base flex-grow border-b-[0.2px]"
            autoFocus={isSearchOpen}
          />
          <Pressable onPress={toggleSearch} className="ml-2">
            <MaterialIcons name="close" size={22} color="darkslategray" />
          </Pressable>
        </>
      )}
    </View>
  );
};

export default CustomHeader;
