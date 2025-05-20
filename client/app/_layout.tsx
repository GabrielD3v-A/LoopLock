import { router, Stack } from 'expo-router';
import '../assets/style/global.css';
import Template from '@/components/template';
import * as SecureStore from 'expo-secure-store'
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';


export default function RootLayout() {
  return (
    <Template>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(screens)/public/login" />
        <Stack.Screen name="(screens)/public/register" />
        <Stack.Screen name="(screens)/auth/safe" />
        <Stack.Screen name="(screens)/auth/generator" />
        <Stack.Screen name="(screens)/auth/checkup" />
        <Stack.Screen name="(screens)/auth/profile" />
      </Stack>
    </Template>
  );
}
