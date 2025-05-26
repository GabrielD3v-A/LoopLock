import Header from '@/components/header';
import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';
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
      </View>
    </SafeAreaView>
  );
}
