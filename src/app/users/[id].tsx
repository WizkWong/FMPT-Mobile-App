import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { getUserById } from "../../services/UserService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import CustomError from "../../components/CustomError";
import { Image } from "expo-image";
import { useEffect } from "react";

const UserPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const imagePath = require("../../assets/edit.png");
        return (
          <Pressable onPress={() => router.push(`users/update?id=${id}`)}>
            <Image className="p-4" source={imagePath} placeholder={"Edit"} />
          </Pressable>
        );
      },
    });
  }, [])


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetchUser"],
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
    <View className="flex flex-col justify-center m-5 space-y-3">
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
        <Text className="text-base font-medium">{data?.data.role ?? "-"}</Text>
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
      <Pressable>
        <Text className="text-base font-medium text-right text-blue-500">
          Reset Password
        </Text>
      </Pressable>
    </View>
  );
};

export default UserPage;
