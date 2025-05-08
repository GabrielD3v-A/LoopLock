import { Link, useFocusEffect, useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import '../assets/style/global.css';
import Logo from '../components/logo';
import React, { useEffect } from 'react';
import ButtonComponent from '@/components/button';

export default function HomeScreen() {

  const router = useRouter();
  
  useFocusEffect(() => {
    router.push('/auth/generator');
  });
  
  return (
    <View className="flex-1  items-center bg-white w-full">

      <View className='w-full bg-lp-blue h-2/5 rounded-b-3xl px-5'>

        <View className='flex flex-row justify-between items-center w-full '>
          <View className='w-40'>
            <Logo></Logo>
          </View>
           
          
          <Text className='font-montserrat text-white'>
            <Link href="/(screens)/public/login">Acesse o cofre</Link>
          </Text>
        </View>

        <View className='w-full flex flex-row items-center justify-between '>
            <View className='w-1/2'>
              <Text className='font-montserrat font-bold text-xl text-white mb-1'>Proteja sua vida </Text>
              <Text className='font-montserrat font-thin text-xs text-white mb-4'>Gerencie sua segurança digital{"\n"}e de seus Familiares</Text>

              <View className='w-2/3'>
                <ButtonComponent text='Saiba mais'  actionKey='changePage' params='(screens)/public/login'></ButtonComponent>
              </View>
              
            </View>

            <View className='w-1/2'>
              <LottieView
                  source={require('../assets/gif/security.json')}  // Caminho para o arquivo JSON da animação
                  autoPlay
                  loop
                  style={{ width: 200, height: 200 }}
                />
            </View>
        </View>

      </View>

      <View className="w-full h-[58%] flex flex-col items-center  px-5 gap-16 ">
        <Text className='text-center font-montserrat font-bold text-xl text-lp-blue my-10'>Por que você deve usar a Loop Lock ?</Text>

        <View className='w-full flex flex-row items-center justify-between '>
            <View className='w-1/2'>
              <Text className='font-montserrat font-bold text-xl text-lp-blue mb-1'>Aqui você {'\n'}vai encontrar: </Text>
              <Text className='font-montserrat font-thin text-xs text-lp-blue mb-4'>
                Segurança em cada site,{'\n'} confiança em cada senha: {'\n'}
                sua vida digital protegida{'\n'} com a LoopLock.
              </Text>
            </View>

            <View className='w-1/2'>
              <LottieView
                  source={require('../assets/gif/projects.json')}  // Caminho para o arquivo JSON da animação
                  autoPlay
                  loop
                  style={{ width: 200, height: 200 }}
                />
            </View>
        </View>


        <View className='w-full flex flex-col items-center '>
          <Text className='font-montserrat font-normal text-sm text-lp-blue mb-1'>Fique mais organizado e seguro</Text>
          <View className='w-full'>
            <ButtonComponent text='Vamos la!'  actionKey='changePage' params='/public/login'></ButtonComponent>
          </View>
        </View>
      </View>
    
    </View>
  );
}
