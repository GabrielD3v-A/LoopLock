import { useAuth } from '@clerk/clerk-expo'
import React from 'react'
import { View, Text } from 'react-native'

export default function safe() {
  return (
    <View className='w-full h-full max-h-fullflex justify-between items-center'>
        <Text>Meu cofre</Text>
    </View>
  )
}
