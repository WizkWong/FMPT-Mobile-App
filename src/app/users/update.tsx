import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { User } from "../../types/user";
import { Picker } from "@react-native-picker/picker";
import { UserRole } from "../../types/enum";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "../../services/UserService";
import { router, useLocalSearchParams } from "expo-router";
import InputWithError from "../../components/InputWithError";
import { AxiosError } from "axios";
import Loading from "../../components/Loading";
import CustomError from "../../components/CustomError";
import ImageInput from "../../components/ImageInput";

const UpdateUserPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetchUser", id],
    queryFn: () => getUserById(+id),
    refetchOnWindowFocus: "always",
  });

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    console.log(error);
    return <CustomError errorMsg={error.message} />
  }

  const [user, setUser] = useState<User>({
    id: data?.data.id,
    username: data?.data.username,
    phoneNo: data?.data.phoneNo,
    role: data?.data.role,
    image: data?.data.image,
  });
  const [errorField, setErrorField] = useState({
    username: "",
    phoneNo: "",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: () => updateUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchUser"] });
      queryClient.invalidateQueries({ queryKey: ["fetchUserList"] });
      router.back();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      const errorMsg = error.response?.data?.message?.split("\n");
      if (errorMsg?.length !== 0) {
        setErrorField({
          username: errorMsg.find((msg) => msg.includes("Username")),
          phoneNo: errorMsg.find((msg) => msg.includes("Phone Number")),
        });
      }
    },
  });

  const handleClick = () => {
    if (isPending) {
      return;
    }
    const error = {
      username: "",
      phoneNo: "",
    };
    if (!user.username) {
      error.username = "Username cannot be empty!";
    }
    if (user.username?.length < 4) {
      error.username = "Username must more than or equal 4 character!";
    }
    if (!user.phoneNo) {
      error.phoneNo = "Phone Number cannot be empty!";
    }
    if (error.username || error.phoneNo) {
      setErrorField(error);
      return;
    }
    mutate();
  };

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
          <ImageInput image={user.image} setImage={(img) => setUser({ ...user, image: img.base64 })} />
        </View>
      </View>
      <View>
        <Pressable
          className="flex flex-row justify-center p-2.5 mt-5 bg-amber-550 rounded"
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

export default UpdateUserPage;