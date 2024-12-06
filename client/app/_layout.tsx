import { Stack } from 'expo-router';
import '../assets/style/global.css';
import Template from '@/components/template';



export default function RootLayout() {
  return (
    <Template>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </Template>
    
  );
}
