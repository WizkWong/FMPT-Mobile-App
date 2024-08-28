import { View, ActivityIndicator } from 'react-native'
import React from 'react'

const Loading = () => {
  return (
    <View className="flex-1 mx-5 my-2 justify-center items-center">
      <ActivityIndicator className='mb-16' animating={true} size={64} color="blue" />
    </View>
  )
}

export default Loading