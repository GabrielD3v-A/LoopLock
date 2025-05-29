import Header from '@/components/header';
import { Tabs } from 'expo-router';
import { Image, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <SafeAreaView> 
      <View className="w-full h-full max-w-full max-h-screen m-0 p-0 ">  
        <Header />
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
              tabBarLabel: ({focused}) => (
                <Text className='text-white text-[8px] text-center' style={{ opacity: focused ? 1 : 0.5 }} >
                  Cofre
                </Text>
              ),
              tabBarIcon: ({ focused }) => (
                <Image
                  source={
                    require('../../assets/images/icons/safe-icon.png')
                  }
                  style={{ width: 32, height: 32, marginBottom: 5, opacity: focused ? 1 : 0.5 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="auth/checkup"
            options={{
              tabBarLabel: ({focused}) => (
                <Text className='text-white text-[8px] text-center' style={{ opacity: focused ? 1 : 0.5 }} >
                  Check-up
                </Text>
              ),
              tabBarIcon:({ focused }) => (
                <Image
                  source={
                    require('../../assets/images/icons/checkup-icon.png')
                  }
                  style={{ width: 32, height: 32, marginBottom: 5, opacity: focused ? 1 : 0.5 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="auth/create-credencial"
            options={{
              title: '',
              tabBarIcon: () => (
                <View className='flex items-center justify-center rounded-full bg-lp-lightblue w-24 h-24' >
                  <Image
                    source={
                      require('../../assets/images/icons/new-icon.png')
                    }
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
              tabBarLabel: ({focused}) => (
                <Text className='text-white text-[8px] text-center' style={{ opacity: focused ? 1 : 0.5 }} >
                  Gerador {'\n'}de Senha
                </Text>
              ),
              tabBarIcon:({ focused }) => (
                <Image
                  source={
                    require('../../assets/images/icons/generate-icon.png')
                  }
                  style={{ width: 32, height: 32, marginBottom: 5, opacity: focused ? 1 : 0.5 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="auth/profile"
            options={{
              tabBarLabel: ({focused}) => (
                <Text className='text-white text-[8px] text-center' style={{ opacity: focused ? 1 : 0.5 }} >
                  Config
                </Text>
              ),
              tabBarLabelStyle: {
                fontSize: 8,
              },
              tabBarIcon:({ focused }) => (
                <Image
                  source={
                    require('../../assets/images/icons/config-icon.png')
                  }
                  style={{ width: 32, height: 32, marginBottom: 5, opacity: focused ? 1 : 0.5 }}
                  resizeMode="contain"
                />
              ),
            }}
          />

        </Tabs>
      </View>
    </SafeAreaView>
  );
}
