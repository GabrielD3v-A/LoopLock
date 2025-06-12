import { router, Stack } from 'expo-router';
import '../assets/style/global.css';
import Template from '@/components/template';
import * as SecureStore from 'expo-secure-store'
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { AuthProvider, useAuth } from './context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  
  const [loaded, error] = useFonts({
    'Montserrat-Bold': require("../assets/fonts/Montserrat/static/Montserrat-Bold.ttf"),
    'Montserrat-Regular': require("../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    'Montserrat-Medium': require("../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    'Montserrat-Light': require("../assets/fonts/Montserrat/static/Montserrat-Light.ttf"),
    'Montserrat-Italic': require("../assets/fonts/Montserrat/static/Montserrat-Italic.ttf"),
    'Montserrat-Thin': require("../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    'Fellix-Light': require("../assets/fonts/Fellix/Fellix-Light.ttf"),
    'Fellix-Medium': require("../assets/fonts/Fellix/Fellix-Medium.ttf"),
    'Fellix-Bold': require("../assets/fonts/Fellix/Fellix-Bold.ttf"),
    'Fellix-Regular': require("../assets/fonts/Fellix/Fellix-Regular.ttf")
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <RoutesLayouts />
    </AuthProvider>
  );
}


export const RoutesLayouts = () => {
  const { authState } = useAuth();

  
  return (
    <Template>
      <Stack screenOptions={{ headerShown: false }}>
        { authState?.authenticated ? (
          <>
            <Stack.Screen name="index" />
            <Stack.Screen name="(screens)/public/login" />
            <Stack.Screen name="(screens)/public/register" />
          </>
        ):(
          <>
            <Stack.Screen name="(tabs)/auth/safe" />
            <Stack.Screen name="(tabs)/auth/generator" />
            <Stack.Screen name="(tabs)/auth/checkup" />
            <Stack.Screen name="(tabs)/auth/profile" />
          </>
        ) }

      </Stack>
    </Template>
  );
}