import { View, Text, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getAllDepartments } from "../../services/UserService";
import { Department } from "../../types/user";
import ItemMenu from "../ItemMenu";
import globalStyles from "../../constants/globalStyles";
import UpdateDepartmentDialog from "./UpdateDepartmentDialog";
import { useState } from "react";
import WarningDialog from "../dialog/WarningDialog";
import DeleteDepartmentDialog from "./DeleteDepartmentDialog";

const DepartmentList = ({
  componentOnClick = () => {},
}: {
  componentOnClick?: (department: Department) => void;
}) => {
  const [isModifyDialogVisible, setModifyDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isWarningDialogVisible, setWarningDialogVisible] = useState(false);
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

  return (
    <>
      <View className="flex flex-col justify-center mx-5 my-2">
        <FlatList
          data={data?.data ?? []}
          renderItem={({ item }: { item: Department }) => (
            <ItemMenu
              key={item.id}
              onPress={() => {
                componentOnClick(item);
              }}
              item={[
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
                    if (item.totalEmployee === 0) {
                      setSelectedDepartment(item);
                      setDeleteDialogVisible(true);
                    } else {
                      setWarningDialogVisible(true);
                    }
                  },
                  titleStyle: globalStyles.redText,
                },
              ]}
            >
              <Text className="flex-1 self-center ml-2 text-2xl">
                {item.name}
              </Text>
              <View className="self-center flex flex-row">
                <Text className="text-xs">Total Employee:</Text>
                <Text className="w-6 text-xs text-right">
                  {item.totalEmployee}
                </Text>
              </View>
            </ItemMenu>
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
      <DeleteDepartmentDialog
        department={selectedDepartment}
        visible={isDeleteDialogVisible}
        onDismiss={() => setDeleteDialogVisible(false)}
      />
      <WarningDialog
        visible={isWarningDialogVisible}
        onDismiss={() => setWarningDialogVisible(false)}
      >
        The department must have 0 employee before delete!
      </WarningDialog>
    </>
  );
};

export default DepartmentList;
