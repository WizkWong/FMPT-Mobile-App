import { useState } from "react";
import { User } from "../../../types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../../services/UserService";
import { router, useLocalSearchParams } from "expo-router";
import { AxiosError } from "axios";
import UserForm from "../../../components/UserForm";
import { UserErrorField } from "../../../types/form";
import useAsyncStorageGet from "../../../hooks/useAsyncStorageGet";
import { Alert } from "react-native";

const UpdateUserPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User>({});
  const [errorField, setErrorField] = useState<UserErrorField>({});

  useAsyncStorageGet<User>({
    key: "user",
    onSuccess: (data) => {
      setUser({
        id: data.id,
        username: data.username,
        phoneNo: data.phoneNo,
        image: data.image,
        role: data.role,
        department: data.department,
      })
    },
    onError: (error) => {
      Alert.alert("Error!", error, [
        { text: "Close & Go Back", onPress: () => router.back() },
      ]);
    }
  });

  const { isPending, mutate } = useMutation({
    mutationFn: () => updateUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchUser", id] });
      queryClient.invalidateQueries({ queryKey: ["fetchUserList"] });
      router.back();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      const errorMsg = error.response?.data?.message?.split("\n");
      if (errorMsg?.length !== 0) {
        setErrorField({
          username: errorMsg.find((msg) => msg.includes("Username")),
          department: errorMsg.find((msg) => msg.includes("Department")),
        });
      }
    },
  });

  const handleClick = () => {
    const error : UserErrorField = {};
    if (!user.username) {
      error.username = "Username cannot be empty!";
    }
    if (user.username?.length < 4) {
      error.username = "Username must more than or equal 4 character!";
    }
    if (!user.department) {
      error.department = "Department cannot be empty!";
    }
    if (Object.keys(error).length !== 0) {
      setErrorField(error);
      return;
    }
    mutate();
  };

  return (
    <UserForm
      user={user}
      setUser={setUser}
      errorField={errorField}
      buttonText="Update"
      handleClick={handleClick}
      loading={isPending}
    />
  );
};

export default UpdateUserPage;