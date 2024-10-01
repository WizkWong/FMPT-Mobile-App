import { Text, View, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";

const ImageInput = ({
  label,
  image,
  setImage,
}: {
  label: string;
  image: string;
  setImage: (imagePicker: ImagePicker.ImagePickerAsset) => any;
}) => {
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your image library!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <Pressable
      className="flex items-center justify-center h-48 w-48 bg-gray-200"
      onPressOut={pickImage}
    >
      {image ? (
        <View className="relative">
          <Image
            className="h-48 w-48"
            source={{ uri: `data:image/jpg;base64,${image}` }}
          />
          <View className="absolute bottom-2 left-2 flex flex-row justify-center items-center bg-zinc-400 rounded-lg px-2 py-1 space-x-1">
            <Image
              className="h-4 w-4"
              source={require("../assets/pencil.png")}
            />
            <Text>Edit</Text>
          </View>
        </View>
      ) : (
        <Text className="text-center">{label}</Text>
      )}
    </Pressable>
  );
};

export default ImageInput;
