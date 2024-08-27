import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, Pressable, Alert } from "react-native";
import { deleteUser, getUserById, resetUserPassword } from "../../services/UserService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import CustomError from "../../components/CustomError";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Button } from "react-native-paper";
import { AxiosError } from "axios";
import SubmitDialog from "../../components/dialog/SubmitDialog";

const UserPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <>
            <Pressable onPress={() => router.push(`users/update?id=${id}`)}>
              <FontAwesome6 name="edit" size={28} color="black" />
            </Pressable>
          </>
        );
      },
    });
  }, []);

  const queryClient = useQueryClient();
  const [isResetVisible, setResetDialogVisible] = useState(false);
  const [isDeactivateDialogVisible, setDeactivateDialogVisible] = useState(false);

  const { isPending, mutate } = useMutation({
    mutationFn: (fn: () => Promise<any>) => fn(),
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      Alert.alert("Error!", error.response?.data?.message ?? error.message, [{ text: "Close" }]);
    },
  });

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

  return (
    <>
      <View className="m-5">
        <View className="flex flex-col justify-center space-y-3">
          <View className="border-b-1">
            <Text className="text-base font-medium">Username:</Text>
            <Text className="text-base font-medium">
              {data?.data.username ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Phone Number:</Text>
            <Text className="text-base font-medium">
              {data?.data.phoneNo ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Role:</Text>
            <Text className="text-base font-medium">
              {data?.data.role ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Department:</Text>
            <Text className="text-base font-medium">
              {data?.data.department ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Created Date & Time:</Text>
            <Text className="text-base font-medium">
              {data?.data.createdDateTime ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Profile Picture:</Text>
            {data?.data.image ? (
              <Image
                className="h-48 w-48 mb-2"
                source={{
                  uri: `data:image/jpg;base64,${data?.data.image}`,
                }}
              />
            ) : (
              <Text className="text-base font-medium">No Image</Text>
            )}
          </View>
        </View>
        <View className="flex flex-row justify-between items-center mt-5">
          <Button
            mode="outlined"
            className="w-36 rounded"
            textColor="#3b82f6"
            labelStyle={{ fontWeight: "bold", marginHorizontal: 0 }}
            onPress={() => setResetDialogVisible(true)}
          >
            Reset Password
          </Button>
          <Button
            mode="contained"
            className="w-32 rounded"
            buttonColor="red"
            textColor="white"
            labelStyle={{ fontWeight: "bold" }}
            onPress={() => setDeactivateDialogVisible(true)}
          >
            Deactivate
          </Button>
        </View>
      </View>
      <SubmitDialog
        title="Reset Password!"
        visible={isResetVisible}
        loading={isPending}
        disabled={isPending}
        submitButtonText="Reset"
        onDismiss={() => setResetDialogVisible(false)}
        onPress={() =>
          mutate(() => resetUserPassword(+id), {
            onSuccess: () => {
              setResetDialogVisible(false);
              Alert.alert(
                "Reset Password Success!",
                `Successfully reset ${data?.data.username} account password`,
                [{ text: "Close" }]
              );
            },
            onError: () => {
              setResetDialogVisible(false);
            },
          })
        }
      >
        Are you sure you want to reset {data?.data.username} account password?
      </SubmitDialog>
      <SubmitDialog
        title="Deactivate Account!"
        visible={isDeactivateDialogVisible}
        loading={isPending}
        disabled={isPending}
        submitButtonText="Deactivate"
        onDismiss={() => setDeactivateDialogVisible(false)}
        onPress={() =>
          mutate(() => deleteUser(+id), {
            onSuccess: () => {
              setDeactivateDialogVisible(false);
              queryClient.invalidateQueries({ queryKey: ["fetchUserList"] });
              router.back();
            },
            onError: () => {
              setDeactivateDialogVisible(false);
            },
          })
        }
      >
        Are you sure you want to deactivate {data?.data.username} account?
      </SubmitDialog>
    </>
  );
};

export default UserPage;
