import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
import React from "react";
import { ProductPart } from "../../types/productPart";
import { Avatar, Card } from "react-native-paper";
import config from "../../constants/config";
import EvilIcons from "@expo/vector-icons/EvilIcons";

const ProductPartList = ({
  data,
  piecesMultiply = 1,
  edit = false,
  onChangePieces,
  onEndEditingPieces,
  onDelete,
}: {
  data: ProductPart[];
  piecesMultiply?: number;
  edit?: boolean;
  onChangePieces?: (text: string, productPart: ProductPart) => void;
  onEndEditingPieces?: (text: string, productPart: ProductPart) => void;
  onDelete?: (productPart: ProductPart) => void;
}) => {
  const renderProductPartItem = ({ item }: { item: ProductPart }) => {
    return (
      <Card className="mx-4 my-2 pr-3">
        <Card.Title
          className="py-2"
          title={item.part.name}
          subtitle={`Grade: ${item.part.grade}\nNett Size:\n${item.part.nettWidth}${config.unitOfMeasurement} x ${item.part.nettHeight}${config.unitOfMeasurement} x ${item.part.nettLength}${config.unitOfMeasurement}`}
          subtitleNumberOfLines={3}
          left={(props) =>
            item.part.image ? (
              <Image
                className="h-11 w-11"
                source={{
                  uri: `data:image/jpg;base64,${item.part.image}`,
                }}
              />
            ) : (
              <Avatar.Icon
                className="rounded-none bg-amber-500"
                {...props}
                color="white"
                size={45}
                icon="image-off-outline"
              />
            )
          }
          right={() =>
            edit ? (
              <View className="flex flex-col space-y-2 items-center">
                <TextInput
                  className="w-10 h-10 bg-gray-200 text-sm text-center"
                  value={item.piece.toString()}
                  onChangeText={(text) => onChangePieces(text, item)}
                  onEndEditing={(e) => onEndEditingPieces(e.nativeEvent.text, item)}
                  keyboardType="number-pad"
                />
                <Pressable onPress={() => onDelete(item)}>
                  <EvilIcons name="trash" size={32} color="red" />
                </Pressable>
              </View>
            ) : (
              <View className="mr-2">
                <Text>Pcs:</Text>
                <Text className="text-center">{item.piece * piecesMultiply}</Text>
              </View>
            )
          }
        />
      </Card>
    );
  };

  return (
    <FlatList
      className="py-1"
      data={data}
      renderItem={renderProductPartItem}
      ListEmptyComponent={() => (
        <Text className="mx-4 my-1 text-xl">No Parts Added</Text>
      )}
      keyExtractor={(item) => item.part.id.toString()}
    />
  );
};

export default ProductPartList;
