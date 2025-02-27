import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import CreateDepartmentDialog from "../../../components/department/CreateDepartmentDialog";
import DepartmentList from "../../../components/department/DepartmentList";

const DepartmentPage = () => {
  const navigation = useNavigation();
  const [isDialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Pressable onPress={() => setDialogVisible(true)}>
            <SimpleLineIcons name="plus" size={28} color="black" />
          </Pressable>
        );
      },
    });
  }, []);

  return (
    <View>
      <DepartmentList />
      <CreateDepartmentDialog
        visible={isDialogVisible}
        onDismiss={() => setDialogVisible(false)}
      />
    </View>
  );
};

export default DepartmentPage;
