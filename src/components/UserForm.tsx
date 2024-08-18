import { View, Text, Pressable } from "react-native";
import InputWithError from "./InputWithError";
import { UserRole } from "../types/enum";
import { Picker } from "@react-native-picker/picker";
import ImageInput from "./ImageInput";
import { User } from "../types/user";

const UserForm = ({
  user,
  setUser,
  errorField,
  buttonText,
  handleClick,
  buttonStatus,
}: {
  user: User;
  setUser: (value: React.SetStateAction<User>) => void;
  errorField: {
    username: string;
    phoneNo: string;
  };
  buttonText: string,
  handleClick: () => void;
  buttonStatus: boolean;
}) => {
  return (
    <View className="flex-1 flex-col justify-between m-5">
      <View className="flex flex-col space-y-2">
        <InputWithError
          label="Username"
          onChangeText={(text) => setUser({ ...user, username: text })}
          value={user.username}
          errorMsg={errorField.username}
        />
        <InputWithError
          label="Phone Number"
          onChangeText={(text) => setUser({ ...user, phoneNo: text })}
          value={user.phoneNo}
          errorMsg={errorField.phoneNo}
        />
        <Text className="text-base font-medium">Role</Text>
        <Picker
          style={{
            backgroundColor: "#E5E7EB",
          }}
          selectedValue={user.role}
          onValueChange={(itemValue) => setUser({ ...user, role: itemValue })}
        >
          <Picker.Item label="Employee" value={UserRole.EMPLOYEE} />
          <Picker.Item label="Manager" value={UserRole.MANAGER} />
          <Picker.Item label="Admin" value={UserRole.ADMIN} />
        </Picker>
        <View>
          <Text className="text-base font-medium mb-3">Profile Picture</Text>
          <ImageInput
            image={user.image}
            setImage={(img) => setUser({ ...user, image: img.base64 })}
          />
        </View>
      </View>
      <View>
        <Pressable
          className="flex flex-row justify-center p-2.5 mt-5 bg-amber-550 rounded"
          onPress={handleClick}
        >
          <Text className="text-base font-semibold text-white tracking-wider">
            {buttonStatus ? "Loading..." : buttonText}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UserForm;
