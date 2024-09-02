import { View, Text, Pressable, Modal } from "react-native";
import InputWithError from "./InputWithError";
import { UserRole } from "../types/enum";
import { Picker } from "@react-native-picker/picker";
import ImageInput from "./ImageInput";
import { User } from "../types/user";
import { UserErrorField } from "../types/form";
import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomHeader from "./CustomHeader";
import CreateDepartmentDialog from "./department/CreateDepartmentDialog";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import DepartmentList from "./department/DepartmentList";
import { Button, Portal, Provider } from "react-native-paper";

const UserForm = ({
  user,
  setUser,
  errorField,
  buttonText,
  handleClick,
  loading,
}: {
  user: User;
  setUser: (value: React.SetStateAction<User>) => void;
  errorField: UserErrorField;
  buttonText: string;
  handleClick: () => void;
  loading: boolean;
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);

  return (
    <Provider>
      <View className="flex-1 flex-col justify-between mx-5 mt-1 mb-5">
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
          <Text className="text-base font-medium">Department</Text>
          <Pressable
            className="flex flex-row items-center p-2.5 bg-gray-200"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-base">
              {user.department ?? "Choose a department"}
            </Text>
            <View className="flex-1 flex flex-row justify-end mr-2">
              <AntDesign name="caretdown" size={9} color="dimgray" />
            </View>
          </Pressable>
          {errorField.department && <Text className="text-sm text-red-500">{errorField.department}</Text>}
          <Modal
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
            animationType="slide"
            presentationStyle="pageSheet"
          >
            <Portal.Host>
              <View className="flex-1 bg-white">
                <CustomHeader
                  title="Select a Department"
                  onPressBack={() => setModalVisible(false)}
                >
                  <Pressable onPress={() => setDialogVisible(true)}>
                    <SimpleLineIcons name="plus" size={28} color="black" />
                  </Pressable>
                </CustomHeader>
                <DepartmentList
                  componentOnPress={(department) => {
                    setUser({ ...user, department: department.name });
                    setModalVisible(false);
                  }}
                />
              </View>
              <CreateDepartmentDialog
                visible={isDialogVisible}
                onDismiss={() => setDialogVisible(false)}
              />
            </Portal.Host>
          </Modal>
          <View>
            <Text className="text-base font-medium mb-3">Profile Picture</Text>
            <ImageInput
              label="Select Profile Picture"
              image={user.image}
              setImage={(img) => setUser({ ...user, image: img.base64 })}
            />
          </View>
        </View>
        <View>
          <Button
            mode="contained-tonal"
            className="mt-5 bg-amber-550 rounded font-bold"
            textColor="white"
            labelStyle={{ fontWeight: "bold" }}
            onPress={handleClick}
            loading={loading}
            disabled={loading}
          >
            {buttonText}
          </Button>
        </View>
      </View>
    </Provider>
  );
};

export default UserForm;
