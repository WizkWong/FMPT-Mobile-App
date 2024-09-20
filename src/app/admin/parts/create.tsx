import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { AxiosError } from "axios";
import { PartErrorField } from "../../../types/form";
import { createPart } from "../../../services/PartService";
import { Part } from "../../../types/productPart";
import InputWithError from "../../../components/InputWithError";
import { View, Text, ScrollView } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import ImageInput from "../../../components/ImageInput";
import config from "../../../constants/config";
import { adjustMoulderSize, isZeroOrEmptyNumber } from "../../../utils/utility";

const NumInput = ({
  label,
  value,
  onChangeText,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error: boolean;
}) => (
  <TextInput
    className="w-24 bg-gray-200"
    label={label}
    placeholder={config.unitOfMeasurement}
    value={value}
    onChangeText={onChangeText}
    error={error}
    underlineColor="transparent"
    keyboardType="decimal-pad"
    style={{ paddingHorizontal: 10 }}
  />
);

const CreatePartPage = () => {
  const queryClient = useQueryClient();
  const [part, setPart] = useState<Part>({});
  const [errorField, setErrorField] = useState<PartErrorField>({});
  const [nettSizeInput, setNettSizeInput] = useState({
    nettWidth: "",
    nettHeight: "",
    nettLength: "",
  });
  const [moulderSizeInput, setMoulderSizeInput] = useState({
    moulderWidth: "",
    moulderHeight: "",
    moulderLength: "",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: () => createPart(part),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchPartList"] });
      router.back();
    },
    onError: (error: AxiosError<any, any>) => {
      console.log(error);
      const errorMsg = error.response?.data?.message?.split("\n");
      if (errorMsg?.length !== 0) {
        setErrorField({
          name: errorMsg.find((msg) => msg.includes("Part name")),
        });
      }
    },
  });

  const handleClick = () => {
    const error: PartErrorField = {};
    if (!part.name) {
      error.name = "Name cannot be empty!";
    }
    if (!part.grade) {
      error.grade = "Grade cannot be empty!";
    }
    if (
      (part.nettWidth || part.nettHeight || part.nettLength) &&
      (!part.nettWidth || !part.nettHeight || !part.nettLength)
    ) {
      error.nettSize = "Nett size cannot be partially empty or exactly zero!";
    }
    if (
      (part.moulderWidth || part.moulderHeight || part.moulderLength) &&
      (!part.moulderWidth || !part.moulderHeight || !part.moulderLength)
    ) {
      error.moulderSize = "Moulder size cannot be partially empty or exactly zero!";
    }
    if (Object.keys(error).length !== 0) {
      setErrorField(error);
      return;
    }
    setErrorField({});
    mutate();
  };

  const handleNettChange = (
    field: keyof typeof nettSizeInput,
    value: string
  ) => {
    const cleanValue = value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    setNettSizeInput((prev) => ({
      ...prev,
      [field]: cleanValue,
    }));
    const size = +cleanValue === 0 ? null : +cleanValue;
    const moulderValue = adjustMoulderSize(size);
    setMoulderSizeInput((prev) => ({
      ...prev,
      [`moulder${field.slice(4)}`]: moulderValue?.toString(),
    }));
    setPart((prev) => ({
      ...prev,
      [field]: size,
      [`moulder${field.slice(4)}`]: moulderValue,
    }));
  };

  const handleMoulderChange = (
    field: keyof typeof moulderSizeInput,
    value: string
  ) => {
    const cleanValue = value.replace(/[^0-9.]/g, "");
    setMoulderSizeInput((prev) => ({
      ...prev,
      [field]: cleanValue,
    }));
    const size = +cleanValue === 0 ? null : +cleanValue;
    setPart((prev) => ({
      ...prev,
      [field]: size,
    }));
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 flex-col justify-between mx-5 mt-1 mb-5">
        <View className="flex flex-col space-y-2">
          <InputWithError
            label="Name"
            onChangeText={(text) => setPart({ ...part, name: text })}
            value={part.name}
            errorMsg={errorField.name}
          />
          <InputWithError
            label="Description"
            onChangeText={(text) => setPart({ ...part, description: text })}
            value={part.description}
            multiline={true}
          />
          <InputWithError
            label="Grade"
            onChangeText={(text) => setPart({ ...part, grade: text })}
            value={part.grade}
            errorMsg={errorField.grade}
          />
          <View>
            <Text className="text-base font-medium my-2">
              Nett Size ({config.unitOfMeasurement})
            </Text>
            <View className="flex flex-row items-center">
              <NumInput
                label="Width"
                value={nettSizeInput.nettWidth}
                onChangeText={(text) => handleNettChange("nettWidth", text)}
                error={
                  errorField.nettSize && isZeroOrEmptyNumber(part.nettWidth)
                }
              />
              <Text className="text-xl font-light mx-1">x</Text>
              <NumInput
                label="Height"
                value={nettSizeInput.nettHeight}
                onChangeText={(text) => handleNettChange("nettHeight", text)}
                error={
                  errorField.nettSize && isZeroOrEmptyNumber(part.nettHeight)
                }
              />
              <Text className="text-xl font-light mx-1">x</Text>
              <NumInput
                label="Length"
                value={nettSizeInput.nettLength}
                onChangeText={(text) => handleNettChange("nettLength", text)}
                error={
                  errorField.nettSize && isZeroOrEmptyNumber(part.nettLength)
                }
              />
            </View>
            {errorField.nettSize && errorField.nettSize.length !== 0 && (
              <Text className="px-0 text-red-500 text-sm">
                {errorField.nettSize}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-base font-medium my-2">
              Moulder Size ({config.unitOfMeasurement})
            </Text>
            <View className="flex flex-row items-center">
              <NumInput
                label="Width"
                value={moulderSizeInput.moulderWidth}
                onChangeText={(text) =>
                  handleMoulderChange("moulderWidth", text)
                }
                error={
                  errorField.moulderSize &&
                  isZeroOrEmptyNumber(part.moulderWidth)
                }
              />
              <Text className="text-xl font-light mx-1">x</Text>
              <NumInput
                label="Height"
                value={moulderSizeInput.moulderHeight}
                onChangeText={(text) =>
                  handleMoulderChange("moulderHeight", text)
                }
                error={
                  errorField.moulderSize &&
                  isZeroOrEmptyNumber(part.moulderHeight)
                }
              />
              <Text className="text-xl font-light mx-1">x</Text>
              <NumInput
                label="Length"
                value={moulderSizeInput.moulderLength}
                onChangeText={(text) =>
                  handleMoulderChange("moulderLength", text)
                }
                error={
                  errorField.moulderSize &&
                  isZeroOrEmptyNumber(part.moulderLength)
                }
              />
            </View>
            {errorField.moulderSize && errorField.moulderSize.length !== 0 && (
              <Text className="px-0 text-red-500 text-sm">
                {errorField.moulderSize}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-base font-medium mb-3">Image</Text>
            <ImageInput
              label="Select Image"
              image={part.image}
              setImage={(img) => setPart({ ...part, image: img.base64 })}
            />
          </View>
        </View>
        <View>
          <Button
            mode="contained-tonal"
            className="mt-5 bg-amber-550 rounded font-bold"
            textColor="white"
            labelStyle={{ fontWeight: "bold" }}
            onPress={handleClick}
            loading={isPending}
            disabled={isPending}
          >
            Create
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreatePartPage;
