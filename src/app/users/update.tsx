import { useState } from "react";
import { User } from "../../types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "../../services/UserService";
import { router, useLocalSearchParams } from "expo-router";
import { AxiosError } from "axios";
import Loading from "../../components/Loading";
import CustomError from "../../components/CustomError";
import UserForm from "../../components/UserForm";
import { UserErrorField } from "../../types/form";

const UpdateUserPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetchUser", id],
    queryFn: () => getUserById(+id),
    refetchOnWindowFocus: "always",
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log(error);
    return <CustomError errorMsg={error.message} />;
  }

  const [user, setUser] = useState<User>({
    id: data?.data.id,
    username: data?.data.username,
    phoneNo: data?.data.phoneNo,
    image: data?.data.image,
    role: data?.data.role,
    department: data?.data.department,
  });
  const [errorField, setErrorField] = useState<UserErrorField>({});

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