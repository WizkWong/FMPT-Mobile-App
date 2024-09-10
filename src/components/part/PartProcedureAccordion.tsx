import { useState } from "react";
import { Button, List } from "react-native-paper";
import { PartProcedure } from "../../types/productPart";
import { View, Text, Alert, Image } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SubmitDialog from "../dialog/SubmitDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePartProcedure } from "../../services/PartService";
import { AxiosError } from "axios";

const PartProcedureAccordion = ({
  partId,
  partProcedure,
}: {
  partId: string;
  partProcedure: PartProcedure;
}) => {
  const [expanded, setExpanded] = useState(true);
  const handlePress = () => setExpanded(!expanded);
  const queryClient = useQueryClient();
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const { isPending, mutate } = useMutation({
    mutationFn: () => deletePartProcedure(+partId, partProcedure.id),
    onSuccess: () => {
      setDeleteDialogVisible(false);
      queryClient.invalidateQueries({
        queryKey: ["fetchPartProcedure", partId],
      });
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      setDeleteDialogVisible(false);
      Alert.alert("Error!", error.response?.data?.message ?? error.message, [
        { text: "Close" },
      ]);
    },
  });

  return (
    <List.Accordion
      title={`Step ${partProcedure.stepNo}`}
      right={(props) => (
        <View className="flex flex-row items-center space-x-3">
          <Text className="text-sm">
            Assign Department: {partProcedure.department}
          </Text>
          {props.isExpanded ? (
            <List.Icon icon="chevron-up" />
          ) : (
            <List.Icon icon="chevron-down" />
          )}
        </View>
      )}
      onPress={handlePress}
    >
      <List.Item
        className="bg-slate-200 p-0"
        title="Description"
        titleStyle={{ fontSize: 18}}
        description={partProcedure.description}
        descriptionNumberOfLines={10}
      />
      <List.Item
        className="bg-slate-200 p-0"
        title="Image"
        titleStyle={{ fontSize: 18}}
        description={
          partProcedure.attachment ? (
            <View>
              <Image
                className="h-48 w-48"
                source={{
                  uri: `data:image/jpg;base64,${partProcedure.attachment}`,
                }}
              />
            </View>
          ) : (
            <Text className="text-base font-medium">No Image</Text>
          )
        }
      />
      <View className="flex flex-col items-end p-2 space-x-2 bg-slate-200">
        <View>
          <Button
            icon={() => <SimpleLineIcons name="plus" size={20} color="black" />}
            mode="contained-tonal"
            className="bg-amber-550 rounded font-bold"
            labelStyle={{ paddingHorizontal: 0 }}
            onPress={() =>
              router.push(
                `parts/${partId}/procedures/create?stepNo=${
                  partProcedure.stepNo + 1
                }`
              )
            }
          >
            Add Next Step
          </Button>
        </View>
        <View className="flex flex-row justify-end mt-2 space-x-2">
          <Button
            icon={() => <FontAwesome6 name="edit" size={20} color="black" />}
            mode="contained-tonal"
            className="bg-amber-550 rounded font-bold"
            onPress={() => {
              AsyncStorage.setItem("partProcedure", JSON.stringify(partProcedure));
              router.push(
                `parts/${partId}/procedures/update?partProcedureId=${partProcedure.id}`
              );
            }}
          >
            Edit
          </Button>
          <Button
            icon="delete"
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
        title={`Deleting Part Procedure`}
        visible={isDeleteDialogVisible}
        loading={isPending}
        disabled={isPending}
        submitButtonText="Delete"
        onDismiss={() => setDeleteDialogVisible(false)}
        onPress={() => mutate()}
      >
        Are you sure you want to delete this part procedure?
      </SubmitDialog>
    </List.Accordion>
  );
};

export default PartProcedureAccordion;
