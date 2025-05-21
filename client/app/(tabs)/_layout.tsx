import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import { StyleSheet } from 'react-native';

export default function AuthLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#03045E',
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="auth/safe"
        options={{
          title: 'Cofre',
          tabBarIcon: () => (
            <Image
              source={
                require('../../assets/images/icons/safe-icon.png')
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="auth/checkup"
        options={{
          title: 'Check-up',
          tabBarIcon: () => (
            <Image
              source={
                require('../../assets/images/icons/checkup-icon.png')
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="auth/create-credencial"
        options={{
          title: 'New',
          tabBarIcon: () => (
            <Image
              source={
                require('../../assets/images/icons/new-icon.png')
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="auth/generator"
        options={{
          title: 'Gerador de senha',
          tabBarIcon: () => (
            <Image
              source={
                require('../../assets/images/icons/generate-icon.png')
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="auth/profile"
        options={{
          title: 'Config',
          tabBarIcon: () => (
            <Image
              source={
                require('../../assets/images/icons/config-icon.png')
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />

    </Tabs>
  );
}
