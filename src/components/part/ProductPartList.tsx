import { View, Text, Image, FlatList } from "react-native";
import React from "react";
import { ProductPart } from "../../types/productPart";
import { Avatar, Card } from "react-native-paper";
import config from "../../constants/config";

const ProductPartList = ({ data }: { data: ProductPart[] }) => {
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
        />
      </Card>
    );
  };

  return (
    <View className="flex flex-col justify-center my-1">
      <FlatList
        data={data}
        renderItem={renderProductPartItem}
        ListEmptyComponent={() => (
          <Text className="mx-4 my-1 text-xl">No Parts Added</Text>
        )}
        keyExtractor={(item) => item.part.id.toString()}
      />
    </View>
  );
};

export default ProductPartList;
