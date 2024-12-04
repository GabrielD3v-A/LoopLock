import { View, Image } from 'react-native'
import React from 'react'

const Logo = () => {
  return (
    <View className='w-40 flex justify-center items-center'>
      <View className='w-full'>
          <Image source={require('../assets/images/logo.png')} className='w-full' resizeMode='contain'/>
      </View>
    </View>
  )
}

export default Logo