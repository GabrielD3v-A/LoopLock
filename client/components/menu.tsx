import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, Image } from 'react-native';

const Menu = () => {
  return (
    <View className="flex-1 w-full m-0 p-0">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#03045E',
            height: 78,
            paddingTop: 10,
          },
        }}
      >
        <Tabs.Screen
          name="auth/safe"
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                className="text-white text-[8px] text-center"
                style={{ opacity: focused ? 1 : 0.5 }}
              >
                Cofre
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../assets/images/icons/safe-icon.png')}
                style={{ width: 32, height: 32, marginBottom: 5, opacity: focused ? 1 : 0.5 }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="auth/checkup"
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                className="text-white text-[8px] text-center"
                style={{ opacity: focused ? 1 : 0.5 }}
              >
                Check-up
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../assets/images/icons/checkup-icon.png')}
                style={{ width: 32, height: 32, marginBottom: 5, opacity: focused ? 1 : 0.5 }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="auth/CreateCredential"
          options={{
            title: '',
            tabBarIcon: () => (
              <View className="flex items-center justify-center rounded-full bg-lp-lightblue w-24 h-24">
                <Image
                  source={require('../assets/images/icons/new-icon.png')}
                  style={{ width: 50, height: 50 }}
                  resizeMode="contain"
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="auth/generator"
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                className="text-white text-[8px] text-center"
                style={{ opacity: focused ? 1 : 0.5 }}
              >
                Gerador {'\n'}de Senha
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../assets/images/icons/generate-icon.png')}
                style={{ width: 32, height: 32, marginBottom: 5, opacity: focused ? 1 : 0.5 }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="auth/profile"
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                className="text-white text-[8px] text-center"
                style={{ opacity: focused ? 1 : 0.5 }}
              >
                Config
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../assets/images/icons/config-icon.png')}
                style={{ width: 32, height: 32, marginBottom: 5, opacity: focused ? 1 : 0.5 }}
                resizeMode="contain"
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default Menu;
