import { useState } from "react";
import { User } from "../../types/user";
import { UserRole } from "../../types/enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../../services/UserService";
import { router } from "expo-router";
import { AxiosError } from "axios";
import UserForm from "../../components/UserForm";

const CreateUserPage = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User>({
    role: UserRole.EMPLOYEE,
  });
  const [errorField, setErrorField] = useState({
    username: "",
    phoneNo: "",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: () => createUser(user),
    onSuccess: () => {
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
    <UserForm
      user={user}
      setUser={setUser}
      errorField={errorField}
      buttonText="Create"
      handleClick={handleClick}
      buttonStatus={isPending}
    />
  );
};

export default CreateUserPage;
