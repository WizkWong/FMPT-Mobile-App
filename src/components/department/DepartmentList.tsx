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
import { Card } from "react-native-paper";
import CustomError from "../CustomError";

const DepartmentList = ({
  componentOnPress = () => {},
}: {
  componentOnPress?: (department: Department) => void;
}) => {
  const [isModifyDialogVisible, setModifyDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isWarningDialogVisible, setWarningDialogVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>({
    id: -1,
    name: "",
  });

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["fetchDepartmentList"],
    queryFn: () => getAllDepartments(),
    staleTime: Infinity,
    refetchOnWindowFocus: "always",
  });

  return (
    <>
      <FlatList
        className="py-1"
        data={data?.data ?? []}
        renderItem={({ item }: { item: Department }) => (
          <Card className="mx-4 my-2" onPress={() => componentOnPress(item)}>
            <Card.Content>
              <View className="flex flex-row items-center justify-end">
                <Text className="mr-auto text-lg">{item.name}</Text>
                <Text className="text-sm">Total: </Text>
                <Text className="mr-4 w-6 text-sm text-right">
                  {item.totalEmployee}
                </Text>
                <ItemMenu
                  key={item.id}
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
                ></ItemMenu>
              </View>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={() => (
          <CustomError
            errorMsg={error?.message ?? "No results of Departments"}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={() => refetch()}
        refreshing={isLoading}
      />
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
