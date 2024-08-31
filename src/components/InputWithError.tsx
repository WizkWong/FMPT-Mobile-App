import { Text, TextInput } from "react-native";

const InputWithError = ({
  label,
  value,
  onChangeText,
  errorMsg,
  keyboardType = "default",
}: {
  label: string;
  value: any;
  onChangeText: (text: string) => void;
  errorMsg?: string;
  keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad" | "url";
}) => {
  return (
    <>
      <Text className="text-base font-medium my-2">{label}</Text>
      <TextInput
        className="p-2.5 bg-gray-200 text-base"
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyboardType}
      />
      {errorMsg && (
        <Text className="mt-1 text-sm text-red-500">{errorMsg}</Text>
      )}
    </>
  );
};

export default InputWithError;
