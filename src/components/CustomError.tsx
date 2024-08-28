import { View, Text } from 'react-native'
import React from 'react'

const CustomError = ({ errorMsg } : { errorMsg : string }) => {
  return (
    <View className="mx-5 my-2">
      <Text className="text-lg font-medium">{errorMsg}</Text>
    </View>
  )
}

export default CustomError