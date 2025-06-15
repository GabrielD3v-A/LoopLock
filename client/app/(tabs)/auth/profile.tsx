import ButtonComponent from '@/components/button';
import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/app/context/AuthContext'; // Importa corretamente o hook

function Profile() {
  const { onLogout, onResetPassword, onGetUser } = useAuth(); // <- aqui você pega o logout corretamente do contexto
  const { authState } = useAuth();

  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      console.log('authState:', authState);
      const userData = await onGetUser(); 
      let user = userData.data.user.user_username;
      setUsername(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await onLogout(); // <- usa corretamente a função
      router.replace('/'); // redireciona para a home ou login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  const handleDisablePassword = async () => {
    try {
      await onResetPassword();
      await onLogout(); 
      router.replace('/(screens)/public/login'); // redireciona para a home ou login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  const handleSafe = () => {
    router.push('/(tabs)/auth/safe');
  };

  const handleGenerator = () => {
    router.push('/(tabs)/auth/generator');
  };

  const handleCheckup = () => {
    router.push('/(tabs)/auth/checkup');
  };

  
  return (
    <View className='flex-1 items-center justify-start bg-white px-8 gap-y-1'>
      <Text className='text-3xl font-normal text-lp-blue mt-10' style={{ fontFamily: 'Fellix-Regular' }}>Configurações</Text>

      <View className='w-full flex flex-row items-center justify-between py-3 border-b border-lp-blue'>
        <View className='flex flex-row items-center h-full gap-x-2 w-3/4'>
          <Image source={require('@/assets/images/icons/user-icon-profile.png')} className='w-10 h-10' />
          <Text className='text-sm font-normal text-lp-blue ' style={{ fontFamily: 'Fellix-Regular' }}>{username}</Text>
        </View>

        <View className='w-auto flex flex-row items-center justify-end'>
          <Pressable onPress={handleLogout}>
            <Text className='text-red-600 underline text-xs' style={{ fontFamily: 'Fellix-Regular' }}>
              Logout
            </Text>
          </Pressable>
        </View>
      </View>

      <Text className='text-xl font-normal text-lp-blue text-left my-4 w-full' style={{ fontFamily: 'Fellix-Medium' }}>Funcionalidades</Text>

      <View className='w-full flex flex-row items-center justify-between flex-wrap gap-y-4 ml-2'>
        <View className='w-48 h-32 flex flex-col items-center justify-center bg-lp-lilas-2 rounded-xl py-2 px-4'>
          <TouchableOpacity onPress={handleSafe}>
            <View className='w-full flex flex-row items-center justify-end'>
              <Text className='text-lp-blue text-lg text-end' style={{ fontFamily: 'Fellix-Medium' }}>1</Text>
            </View>
            <View className='w-full flex flex-col items-start'>
              <Image source={require('@/assets/images/config/1.png')} className='w-10 h-10' />
              <Text className='text-lp-blue text-xs text-center my-1' style={{ fontFamily: 'Montserrat-Regular' }} > 
                Meu Cofre
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className='w-48 h-32 flex flex-col items-center justify-center bg-lp-lilas-2 rounded-xl py-2 px-4'>
          <TouchableOpacity onPress={handleGenerator}>
            <View className='w-full flex flex-row items-center justify-end'>
              <Text className='text-lp-blue text-lg text-end' style={{ fontFamily: 'Fellix-Medium' }}>2</Text>
            </View>
            <View className='w-full flex flex-col items-start'>
              <Image source={require('@/assets/images/config/2.png')} className='w-10 h-10' />
              <Text className='text-lp-blue text-xs text-center my-1' style={{ fontFamily: 'Montserrat-Regular' }} > 
                Gerador de senha
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className='w-48 h-32 flex flex-col items-center justify-center bg-lp-lilas-2 rounded-xl py-2 px-4'>
          <TouchableOpacity onPress={handleCheckup}>
            <View className='w-full flex flex-row items-center justify-end'>
              <Text className='text-lp-blue text-lg text-end' style={{ fontFamily: 'Fellix-Medium' }}>3</Text>
            </View>
            <View className='w-full flex flex-col items-start'>
              <Image source={require('@/assets/images/config/3.png')} className='w-10 h-10' />
              <Text className='text-lp-blue text-xs text-center my-1' style={{ fontFamily: 'Montserrat-Regular' }} > 
                Check-up
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className='w-48 h-32 flex flex-col items-center justify-center bg-lp-lilas-2 rounded-xl py-2 px-4'>
          <TouchableOpacity onPress={handleDisablePassword}>
            <View className='w-full flex flex-row items-center justify-end'>
              <Text className='text-lp-blue text-lg text-end' style={{ fontFamily: 'Fellix-Medium' }}>4</Text>
            </View>
            <View className='w-full flex flex-col items-start'>
              <Image source={require('@/assets/images/config/4.png')} className='w-10 h-10' />
              <Text className='text-lp-blue text-xs text-center my-1' style={{ fontFamily: 'Montserrat-Regular' }} > 
                Desabilitar senha salva
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      
      </View>

      <Text className='text-xl font-normal text-lp-blue text-left my-4 w-full' style={{ fontFamily: 'Fellix-Medium' }}>Configurações básicas</Text>

      <View className='w-full flex flex-col items-start gap-y-2 ml-2'>
        <Text className='text-lp-blue text-sm' style={{ fontFamily: 'Montserrat-Regular' }} >Segurança da conta</Text>
        <Text className='text-lp-blue text-sm' style={{ fontFamily: 'Montserrat-Regular' }} >Aparência</Text>
        <Text className='text-lp-blue text-sm' style={{ fontFamily: 'Montserrat-Regular' }} >Sobre</Text>
        <Text className='text-lp-blue text-sm' style={{ fontFamily: 'Montserrat-Regular' }} >Outros</Text>

      </View>


    </View>
  );
}

export default Profile;
