import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Alert, ScrollView } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import CustomError from "../../components/CustomError";
import { Image } from "expo-image";
import { useState } from "react";
import { Button } from "react-native-paper";
import { AxiosError } from "axios";
import SubmitDialog from "../../components/dialog/SubmitDialog";
import { deletePart, getPartById } from "../../services/PartService";
import config from "../../constants/config";

const PartPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const queryClient = useQueryClient();
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const { isPending, mutate } = useMutation({
    mutationFn: () => deletePart(+id),
    onSuccess: () => {
      setDeleteDialogVisible(false);
      queryClient.invalidateQueries({ queryKey: ["fetchPartList"] });
      router.back();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      setDeleteDialogVisible(false);
      Alert.alert("Error!", error.response?.data?.message ?? error.message, [
        { text: "Close" },
      ]);
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetchPart", id],
    queryFn: () => getPartById(+id),
    refetchOnWindowFocus: "always",
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log(error);
    return <CustomError errorMsg={error.message} />;
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="m-5">
        <View className="flex flex-col justify-center space-y-3">
          <View className="border-b-1">
            <Text className="text-base font-medium">Name:</Text>
            <Text className="text-base font-medium">
              {data?.data.name ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Grade:</Text>
            <Text className="text-base font-medium">
              {data?.data.grade ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Description:</Text>
            <Text className="text-base font-medium">
              {data?.data.description ?? "-"}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Nett Size:</Text>
            <Text className="text-base font-medium">
              {data?.data.nettWidth}
              {config.unitOfMeasurement} x {data?.data.nettHeight}
              {config.unitOfMeasurement} x {data?.data.nettLength}
              {config.unitOfMeasurement}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Moulder Size:</Text>
            <Text className="text-base font-medium">
              {data?.data.nettWidth}
              {config.unitOfMeasurement} x {data?.data.nettHeight}
              {config.unitOfMeasurement} x {data?.data.nettLength}
              {config.unitOfMeasurement}
            </Text>
          </View>
          <View className="border-b-1">
            <Text className="text-base font-medium">Image:</Text>
            {data?.data.image ? (
              <Image
                className="h-48 w-48 mb-2"
                source={{
                  uri: `data:image/jpg;base64,${data?.data.image}`,
                }}
              />
            ) : (
              <Text className="text-base font-medium">No Image</Text>
            )}
          </View>
        </View>
        <View className="flex flex-row items-center mt-5">
          <Button
            mode="contained"
            className="w-24 rounded"
            buttonColor="red"
            textColor="white"
            labelStyle={{ fontWeight: "bold" }}
            onPress={() => setDeleteDialogVisible(true)}
          >
            Delete
          </Button>
        </View>
      </View>
      <SubmitDialog
        title={`Deleting ${data?.data.name}`}
        visible={isDeleteDialogVisible}
        loading={isPending}
        disabled={isPending}
        submitButtonText="Delete"
        onDismiss={() => setDeleteDialogVisible(false)}
        onPress={() => mutate()}
      >
        Are you sure you want to delete {data?.data.name} part?
      </SubmitDialog>
    </ScrollView>
  );
};

export default PartPage;
