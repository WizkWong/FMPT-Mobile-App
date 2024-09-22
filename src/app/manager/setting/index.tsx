import { ScrollView, View, Text, Image, Pressable } from "react-native";
import useUserDetails from "../../../hooks/useUserDetails";
import { capitalizedCase } from "../../../utils/utility";
import globalStyles from "../../../constants/globalStyles";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

const ProfilePage = () => {
  const [userDetail] = useUserDetails();
  const queryClient = useQueryClient();

  const logOut = async () => {
    queryClient.removeQueries();
    await SecureStore.deleteItemAsync("auth");
    router.replace("/login");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="space-y-1 mx-3">
        <View className="py-1">
          <Text className="m-3 ml-2 text-sm font-medium text-[#a69f9f]">
            ACCOUNT
          </Text>

          <View
            className="flex flex-row p-3 bg-white rounded-xl items-center justify-start"
            style={[globalStyles.lightShadow, { borderRadius: 12 }]}
          >
            <Image
              alt="profile"
              source={{
                uri: userDetail?.user.image
                  ? userDetail?.user.image
                  : `https://ui-avatars.com/api/?name=${userDetail?.user.username}&color=7F9CF5&background=EBF4FF`,
              }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 9999,
                marginRight: 12,
              }}
            />
            <View className="mr-auto">
              <Text className="text-base font-semibold text-[#292929]">
                {userDetail?.user.username}
              </Text>
              <Text className="mt-0.5 text-sm font-normal text-[#858585]">
                {userDetail?.user.phoneNo}
              </Text>
              <Text className="mt-0.5 text-sm font-normal text-[#858585]">
                {userDetail?.user.department}
              </Text>
              <Text className="mt-0.5 text-sm font-normal text-[#858585]">
                {capitalizedCase(userDetail?.user.role ?? "")}
              </Text>
            </View>
          </View>
        </View>
        <View className="pt-3">
          <View
            className="bg-white"
            style={[globalStyles.lightShadow, { borderRadius: 12 }]}
          >
            <Pressable
              onPress={() => logOut()}
              className="flex flex-row h-11 w-full justify-center items-center"
            >
              <Text className="text-center text-red-600 text-base font-semibold">
                Log Out
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
