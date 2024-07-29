import { useEffect, useState } from "react";
import { View, Text, Alert, BackHandler } from "react-native";
import { AuthenticationUserDetails } from "../../types/user";
import { getSecureAuth } from "../../utils/SecureStore";

const Home = () => {
  const [userDetails, setUserDetails] = useState<AuthenticationUserDetails>();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert(
          "Exit App",
          "Do you want to exit?",
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            { text: "YES", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );

        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const data = await getSecureAuth();
        data.ifPresent((s) => setUserDetails(s as unknown as AuthenticationUserDetails));
      } catch (error) {
        console.log(error);
      }
    };
    getUserDetails();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Home Page</Text>
    </View>
  );
};

export default Home;
