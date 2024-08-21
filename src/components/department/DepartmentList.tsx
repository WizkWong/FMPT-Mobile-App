import { View, Text, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getAllDepartments } from "../../services/UserService";
import { Department } from "../../types/user";
import ItemMenu from "../ItemMenu";
import globalStyles from "../../constants/globalStyles";

const DepartmentList = ({
  componentOnClick = () => {},
}: {
  componentOnClick?: (department: Department) => void;
}) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["fetchDepartmentList"],
    queryFn: () => getAllDepartments(),
    staleTime: 60000,
    refetchOnWindowFocus: "always",
  });

  return (
    <View className="flex flex-col justify-center mx-5 my-2">
      <FlatList
        data={data?.data ?? []}
        renderItem={({ item }: { item: Department }) => (
          <ItemMenu
            key={item.id}
            title={item.name}
            onPress={() => {componentOnClick(item)}}
            itemMenu={[
              { title: "Modify", onPress: () => {} },
              { title: "Delete", onPress: () => {}, titleStyle: globalStyles.redText },
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
  );
};

export default DepartmentList;
