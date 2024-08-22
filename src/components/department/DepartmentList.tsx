import { View, Text, FlatList, Alert } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteDepartment,
  getAllDepartments,
} from "../../services/UserService";
import { Department } from "../../types/user";
import ItemMenu from "../ItemMenu";
import globalStyles from "../../constants/globalStyles";
import UpdateDepartmentDialog from "./UpdateDepartmentDialog";
import { useState } from "react";
import { Button, Dialog, IconButton, Portal } from "react-native-paper";
import { AxiosError } from "axios";

const DepartmentList = ({
  componentOnClick = () => {},
}: {
  componentOnClick?: (department: Department) => void;
}) => {
  const queryClient = useQueryClient();
  const [isModifyDialogVisible, setModifyDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>({
    id: -1,
    name: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["fetchDepartmentList"],
    queryFn: () => getAllDepartments(),
    staleTime: 60000,
    refetchOnWindowFocus: "always",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: () => deleteDepartment(selectedDepartment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchDepartmentList"] });
      setDeleteDialogVisible(false);
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      setDeleteDialogVisible(false);
      Alert.alert("Error!", error.response.data?.message, [{ text: "OK" }]);
    },
  });

  return (
    <>
      <View className="flex flex-col justify-center mx-5 my-2">
        <FlatList
          data={data?.data ?? []}
          renderItem={({ item }: { item: Department }) => (
            <ItemMenu
              key={item.id}
              title={item.name}
              onPress={() => {
                componentOnClick(item);
              }}
              itemMenu={[
                {
                  title: "Modify",
                  onPress: () => {
                    setSelectedDepartment(item);
                    setModifyDialogVisible(true);
                  },
                },
                {
                  title: "Delete",
                  onPress: () => {
                    setSelectedDepartment(item);
                    setDeleteDialogVisible(true);
                  },
                  titleStyle: globalStyles.redText,
                },
              ]}
            ></ItemMenu>
          )}
          ListEmptyComponent={() => (
            <Text className="text-lg font-medium">Empty Departments</Text>
          )}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={() => refetch()}
          refreshing={isLoading}
        />
      </View>
      <UpdateDepartmentDialog
        department={selectedDepartment}
        visible={isModifyDialogVisible}
        onDismiss={() => setModifyDialogVisible(false)}
      />
      <Portal>
        <Dialog
          visible={isDeleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <View className="flex flex-row justify-between items-center">
            <Dialog.Title className="text-lg font-bold text-red-500">
              Warning!
            </Dialog.Title>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setDeleteDialogVisible(false)}
            />
          </View>
          <Dialog.Content>
            <Text className="leading-normal">
              Are you sure you want to delete Deparment{" "}
              {selectedDepartment.name} ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions className="space-x-2">
            <Button
              className="bg-amber-550 px-1"
              mode="contained"
              onPress={() => setDeleteDialogVisible(false)}
            >
              Cancel
            </Button>
            <Button
              className="px-1"
              textColor="#d97706"
              style={{borderColor: '#d97706'}}
              mode="outlined"
              loading={isPending}
              disabled={isPending}
              onPress={() => mutate()}
            >
              Comfirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default DepartmentList;
