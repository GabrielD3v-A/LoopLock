import { useAuth } from '@clerk/clerk-expo'
import React from 'react'
import { View, Text } from 'react-native'

export default function safe() {
  const { isLoaded, userId, sessionId } = useAuth()
  
  return (
    <View>
        <Text>Meu cofre</Text>
        <Text>
          Hello, {userId} your current active session is {sessionId}
        </Text>
    </View>
  )
}
