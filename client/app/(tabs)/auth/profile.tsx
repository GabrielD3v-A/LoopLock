import ButtonComponent from '@/components/button';
import React from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/app/context/AuthContext'; // Importa corretamente o hook

function Profile() {
  const { onLogout } = useAuth(); // <- aqui você pega o logout corretamente do contexto

  const handleLogout = async () => {
    try {
      await onLogout(); // <- usa corretamente a função
      router.replace('/'); // redireciona para a home ou login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  return (
    <Pressable onPress={handleLogout}>
      <Text className='text-red-950 underline text-lg my-10'>
        Logout
      </Text>
    </Pressable>
  );
}

export default Profile;
