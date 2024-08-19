import { View, Text, Pressable, FlatList, Modal, Alert } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDepartment, getAllDepartments } from "../services/UserService";
import { Department } from "../types/user";
import CustomHeader from "./CustomHeader";
import DialogInput from "react-native-dialog-input";
import { useState } from "react";
import { AxiosError } from "axios";

const DepartmentListModal = ({
  visible,
  onRequestClose,
  componentOnClick,
}: {
  visible: boolean;
  onRequestClose: () => void;
  componentOnClick: (department: Department) => void;
}) => {
  const [isDialogVisible, setDialogVisible] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["fetchDepartmentList"],
    queryFn: () => getAllDepartments(),
    staleTime: 60000,
    refetchOnWindowFocus: "always",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: (departmentName: string) => createDepartment(departmentName),
    onSuccess: () => {
      refetch();
      setDialogVisible(false);
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      Alert.alert("Error", error.message, [{ text: "OK" }]);
    },
  });

  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        <CustomHeader title="Select a Department" onPressBack={onRequestClose}>
          <Pressable onPress={() => setDialogVisible(true)}>
            <SimpleLineIcons name="plus" size={28} color="black" />
          </Pressable>
        </CustomHeader>
        <View className="flex flex-col justify-center mx-5 my-2">
          <FlatList
            data={data?.data ?? []}
            renderItem={({ item }: { item: Department }) => (
              <Pressable
                className="p-2 border-b-1 my-1"
                onPress={() => componentOnClick(item)}
              >
                <Text className="text-2xl">{item.name}</Text>
              </Pressable>
            )}
            ListEmptyComponent={() => (
              <Text className="text-lg font-medium">Empty Departments</Text>
            )}
            keyExtractor={(item) => item.id.toString()}
            onRefresh={() => refetch()}
            refreshing={isLoading}
          />
        </View>
      </View>
      <DialogInput
        isDialogVisible={isDialogVisible}
        title={isPending ? "Creating Department..." : "Create Department"}
        message={
          isPending
            ? "Please wait for the moment"
            : "Please enter the department name:"
        }
        hintInput={"Department"}
        submitInput={(inputText) => {
          if (!isPending) {
            mutate(inputText);
          }
        }}
        closeDialog={() => setDialogVisible(false)}
      ></DialogInput>
    </Modal>
  );
};

export default DepartmentListModal;
