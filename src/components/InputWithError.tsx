import { Text, TextInput } from "react-native";

const InputWithError = ({ label, value, onChangeText, errorMsg } : { label: string, value: any, onChangeText : (text: string) => void, errorMsg: string }) => {
  return (
    <>
      <Text className="text-base font-medium my-2">{label}</Text>
      <TextInput
        className="p-2.5 bg-gray-200 rounded tracking-wider text-base text-black"
        onChangeText={onChangeText}
        value={value}
      />
      {errorMsg && <Text className="mt-1 text-sm text-red-500">{errorMsg}</Text>}
    </>
  );
};

export default InputWithError;
