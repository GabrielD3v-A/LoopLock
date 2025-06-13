import { Stack } from 'expo-router';
import '../assets/style/global.css';
import Template from '@/components/template';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
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
      <Template>
        <RoutesLayouts />
      </Template>
    </AuthProvider>
  );
}

function RoutesLayouts() {
  const { authState, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {authState?.authenticated ? (
        <>
          <Stack.Screen name="(tabs)/auth/safe" />
          <Stack.Screen name="(tabs)/auth/generator" />
          <Stack.Screen name="(tabs)/auth/checkup" />
          <Stack.Screen name="(tabs)/auth/profile" />
        </>
      ) : (

        <>
          <Stack.Screen name="index" />
          <Stack.Screen name="(screens)/public/login" />
          <Stack.Screen name="(screens)/public/register" />
        </>
      )}
    </Stack>
  );
}
