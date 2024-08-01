import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { User } from "../../types/user";
import { Picker } from "@react-native-picker/picker";
import { UserRole } from "../../types/enum";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "../../services/UserService";
import { router } from "expo-router";

const CreateUserPage = () => {
  const [user, setUser] = useState<User>({
    role: UserRole.EMPLOYEE,
  });

  const { isPending, isError, error, mutate } = useMutation({
    mutationFn: () => createUser(user),
    onSuccess: () => {
      router.back();
    }
  });

  if (isError) {
    console.log(error);
  }

  const handleClick = () => {
    if (!isPending) {
      mutate();
    }
  };

  return (
    <View className="flex-1 flex-col justify-between m-5">
      <View className="flex flex-col space-y-2">
        <Text className="text-base font-medium">Username</Text>
        <View className="flex flex-col p-2.5 mt-2.5 bg-gray-200 rounded tracking-wider">
          <TextInput
            className="text-base text-black"
            onChangeText={(text) => setUser({ ...user, username: text })}
            value={user.username}
          />
        </View>
        <Text className="text-base font-medium">Phone Number</Text>
        <View className="flex flex-col p-2.5 mt-2.5 bg-gray-200 rounded tracking-wider">
          <TextInput
            className="pt-1 text-base text-black"
            onChangeText={(text) => setUser({ ...user, phoneNo: text })}
            value={user.phoneNo}
          />
        </View>
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
      </View>
      <View>
        <Pressable
          className={`flex flex-row justify-center p-2.5 mt-5 bg-amber-550 rounded`}
          onPress={handleClick}
        >
          <Text className="text-base font-semibold text-white tracking-wider">
            {isPending ? "Loading..." : "Create"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CreateUserPage;
