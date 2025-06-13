import ButtonComponent from '@/components/button';
import React from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/app/context/AuthContext'; // Importa corretamente o hook

function Profile() {
  const { onLogout, onResetPassword } = useAuth(); // <- aqui você pega o logout corretamente do contexto

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

  return (
    <View>
    <Pressable onPress={handleLogout}>
      <Text className='text-red-950 underline text-lg my-10'>
        Logout
      </Text>
    </Pressable>

    <Pressable onPress={handleDisablePassword}>
      <Text className='text-red-950 underline text-lg my-10'>
        Desabilitar Senha salva
      </Text>
    </Pressable>

    </View>
  );
}

export default Profile;
