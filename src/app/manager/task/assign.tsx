import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, Alert, ScrollView, Pressable } from "react-native";
import { useEffect, useState } from "react";
import useAsyncStorageGet from "../../../hooks/useAsyncStorageGet";
import { EmployeeTask } from "../../../types/task";
import EmployeeList from "../../../components/user/EmployeeList";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createEmployeeTask } from "../../../services/TaskService";
import { Button } from "react-native-paper";
import EmployeeScoreListModal from "../../../components/user/EmployeeScoreListModal";
import { UserRole } from "../../../types/enum";

const AssignEmployeePage = () => {
  const { taskId, department } = useLocalSearchParams<{
    taskId: string;
    department: string;
  }>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [employeeTaskList, setEmployeeTaskList] = useState<EmployeeTask[]>([]);
  const [updateEmployeeTaskList, setUpdateEmployeeTaskList] = useState<
    EmployeeTask[]
  >([]);
  const [isEmployeeModalVisible, setEmployeeModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Pressable onPress={() => setEmployeeModalVisible(true)}>
            <SimpleLineIcons name="plus" size={28} color="black" />
          </Pressable>
        );
      },
    });
  }, []);

  const { isPending, mutate } = useMutation({
    mutationFn: () => createEmployeeTask(+taskId, updateEmployeeTaskList),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchTask", taskId] });
      router.back();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      Alert.alert("Error!", error.response?.data?.message ?? error.message, [
        { text: "Close" },
      ]);
    },
  });

  useAsyncStorageGet<EmployeeTask[]>({
    key: "employeeList",
    onSuccess: (data) => setEmployeeTaskList([...data]),
    onError: (error) => {
      Alert.alert("Error!", error, [
        { text: "Close & Go Back", onPress: () => router.back() },
      ]);
    },
  });

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="mx-3 my-1">
        <Text className="m-3 ml-1 text-sm font-medium text-gray-500">
          Selected Employees
        </Text>
        <EmployeeList employeeTaskList={employeeTaskList} />
        <Text className="m-3 ml-1 text-sm font-medium text-gray-500">
          Assign Employees
        </Text>
        <EmployeeList
          employeeTaskList={updateEmployeeTaskList}
          allowRemove={true}
          removeFn={(e) =>
            setUpdateEmployeeTaskList((prev) =>
              prev.filter((pe) => pe.employee.id !== e.employee.id)
            )
          }
        />
        {updateEmployeeTaskList.length !== 0 && (
          <Button
            mode="contained-tonal"
            className="mt-5 bg-amber-550 rounded font-bold"
            textColor="white"
            labelStyle={{ fontWeight: "bold" }}
            onPress={() => mutate()}
            loading={isPending}
            disabled={isPending}
          >
            Assign Employee
          </Button>
        )}
      </View>
      <EmployeeScoreListModal
        visible={isEmployeeModalVisible}
        onModalClose={() => setEmployeeModalVisible(false)}
        componentOnPress={(employee) => {
          setUpdateEmployeeTaskList((prev) => {
            const foundIndex = prev.findIndex(
              (employeeTask) => employeeTask.employee.id === employee.id
            );
            if (foundIndex >= 0) {
              return prev;
            }
            return [...prev, { employee: {...employee, role: UserRole.EMPLOYEE }}];
          });
          setEmployeeModalVisible(false);
        }}
        filterByDepartment={department}
      />
    </ScrollView>
  );
};

export default AssignEmployeePage;
