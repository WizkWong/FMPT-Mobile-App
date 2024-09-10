import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Button, Portal, Provider } from "react-native-paper";
import { PartProcedure } from "../../types/productPart";
import { PartProcedureErrorField } from "../../types/form";
import InputWithError from "../InputWithError";
import CustomHeader from "../CustomHeader";
import CreateDepartmentDialog from "../department/CreateDepartmentDialog";
import DepartmentList from "../department/DepartmentList";
import ImageInput from "../ImageInput";

const PartProcedureForm = ({
  partProcedure,
  setPartProcedure,
  errorField,
  buttonText,
  handleClick,
  loading,
}: {
  partProcedure: PartProcedure;
  setPartProcedure: (value: React.SetStateAction<PartProcedure>) => void;
  errorField: PartProcedureErrorField;
  buttonText: string;
  handleClick: () => void;
  loading: boolean;
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);

  return (
    <Provider>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 flex-col justify-between mx-5 mt-1 mb-5">
          <View className="flex flex-col space-y-2">
            <InputWithError
              label="Description"
              onChangeText={(text) => setPartProcedure({ ...partProcedure, description: text })}
              value={partProcedure.description}
              multiline={true}
              errorMsg={errorField.description}
            />
            <Text className="text-base font-medium">Department</Text>
            <Pressable
              className="flex flex-row items-center p-2.5 bg-gray-200"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-base">
                {partProcedure.department ?? "Choose a department"}
              </Text>
              <View className="flex-1 flex flex-row justify-end mr-2">
                <AntDesign name="caretdown" size={9} color="dimgray" />
              </View>
            </Pressable>
            {errorField.department && (
              <Text className="text-sm text-red-500">
                {errorField.department}
              </Text>
            )}
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
                      setPartProcedure({ ...partProcedure, department: department.name });
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
              <Text className="text-base font-medium mb-3">
                Profile Picture
              </Text>
              <ImageInput
                label="Select Profile Picture"
                image={partProcedure.attachment}
                setImage={(img) => setPartProcedure({ ...partProcedure, attachment: img.base64 })}
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
      </ScrollView>
    </Provider>
  );
};

export default PartProcedureForm;
