import { Stack } from 'expo-router';
import '../assets/style/global.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
