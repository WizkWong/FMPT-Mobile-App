import { useQuery } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";
import { getPartProcedureByPartId } from "../../../../services/PartService";
import { router, useLocalSearchParams } from "expo-router";
import Loading from "../../../../components/Loading";
import CustomError from "../../../../components/CustomError";
import PartProcedureAccordion from "../../../../components/part/PartProcedureAccordion";
import { Button } from "react-native-paper";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const PartProcedurePage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetchPartProcedure", id],
    queryFn: () => getPartProcedureByPartId(+id),
    refetchOnWindowFocus: "always",
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log(error);
    return <CustomError errorMsg={error.message} />;
  }

  if (data?.data.length === 0) {
    return (
      <View className="flex flex-row justify-center mx-4 my-2">
        <Button
          icon={() => <SimpleLineIcons name="plus" size={20} color="black" />}
          mode="contained-tonal"
          className="bg-amber-550 rounded font-bold"
          onPress={() => router.push(`parts/${id}/procedures/create?stepNo=1`)}
        >
          Add New Step
        </Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {data?.data.map((partProcedure, index) => (
        <PartProcedureAccordion
          key={index}
          partId={id}
          partProcedure={partProcedure}
        />
      ))}
    </ScrollView>
  );
};

export default PartProcedurePage;
