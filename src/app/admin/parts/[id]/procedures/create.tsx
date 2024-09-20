import { useState } from "react";
import PartProcedureForm from "../../../../../components/part/PartProcedureForm";
import { PartProcedure } from "../../../../../types/productPart";
import { PartProcedureErrorField } from "../../../../../types/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPartProcedure } from "../../../../../services/PartService";
import { router, useLocalSearchParams } from "expo-router";
import { AxiosError } from "axios";
import { Alert } from "react-native";

const CreatePartProcedurePage = () => {
  const { id, stepNo } = useLocalSearchParams<{ id: string; stepNo: string }>();
  const queryClient = useQueryClient();
  const [partProcedure, setPartProcedure] = useState<PartProcedure>({
    stepNo: +stepNo,
  });
  const [errorField, setErrorField] = useState<PartProcedureErrorField>({});

  const { isPending, mutate } = useMutation({
    mutationFn: () => createPartProcedure(+id, partProcedure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchPartProcedure", id] });
      router.back();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      const errorMsg = error.response?.data?.message?.split("\n");
      if (error.response?.status === 400 && errorMsg?.length !== 0) {
        setErrorField({
          department: errorMsg.find((msg) => msg.includes("Department")),
        });
      } else {
        Alert.alert("Error!", error.response?.data?.message ?? error.message, [
          { text: "Close" },
        ]);
      }
    },
  });

  const handleClick = () => {
    const error: PartProcedureErrorField = {};
    if (!partProcedure.description) {
      error.description = "Description cannot be empty!";
    }
    if (!partProcedure.department) {
      error.department = "Department cannot be empty!";
    }
    if (Object.keys(error).length !== 0) {
      setErrorField(error);
      return;
    }
    setErrorField({});
    mutate();
  };

  return (
    <PartProcedureForm
      partProcedure={partProcedure}
      setPartProcedure={setPartProcedure}
      errorField={errorField}
      buttonText="Create Next Step"
      handleClick={handleClick}
      loading={isPending}
    />
  );
};

export default CreatePartProcedurePage;
