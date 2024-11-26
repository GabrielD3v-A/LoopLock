import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

export default function Login() {
  return (
    <View >
      <Text>Quero logar</Text>
      <Link href="/">View details</Link>
    </View>
  )
}