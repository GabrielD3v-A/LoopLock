import SafeProvider, { useSafe } from '@/app/context/SafeContext';
import { Link, router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, FlatList, Alert, TextInput } from 'react-native';

export default function SafeWrapper() {
  return (
    <SafeProvider>
      <Safe />
    </SafeProvider>
  );
}

interface Credential {
  credential_name: string;
  credential_slug: string;
}

export function Safe() {
  const { loading, onListSafe } = useSafe();
  const [allCredentials, setAllCredentials] = useState<Credential[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [search, setSearch] = useState('');

  const listCredentials = async () => {
    try {
      const result = await onListSafe();
      if (result.error) {
        console.log(result);
        Alert.alert('Erro', result.message);
        router.replace('/');
      } else {
        setCredentials(result.data.credentials); // garanta que seja um array
        setAllCredentials(result.data.credentials);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao listar credenciais');
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!loading) {
        listCredentials();
      }
    }, [loading])
  );



  const handleChangeText = (text: string) => {
    setSearch(text);

    if (text.trim() === '') {
      setCredentials(allCredentials);
      return;
    }

    const filtered = allCredentials.filter((cred) =>
      cred.credential_name.toLowerCase().includes(text.toLowerCase())
    );

    setCredentials(filtered);
  };



  const renderItem = ({ item }: { item: Credential }) => (
    <View className="px-4 py-2 bg-lp-lilas rounded-full text-xs flex flex-row items-center justify-between my-2 mx-5">
      <View className="flex flex-row items-center">
        <Image
          source={require('../../../assets/images/credentials/template.png')}
          className="w-12 h-12 rounded-full mr-2"
        />
        <View className="flex flex-col items-start">
          <Text className="text-lp-blue text-sm font-montserrat-bold">{item.credential_name}</Text>
          <Text className="text-lp-blue-2 text-xs font-montserrat-light">{item.credential_name}</Text>
        </View>
      </View>
      <Image
        source={require('../../../assets/images/icons/arrow.png')}
        className="w-8 h-8 ml-2"
      />
    </View>
  );

  return (
    <View className="flex-1 items-center justify-start bg-white px-6 gap-y-1">
      <Text className="text-3xl font-normal text-lp-blue mt-5 mb-3" style={{ fontFamily: 'Montserrat-Regular' }}>
        Meu Cofre
      </Text>

      <View className="w-full h-5/6 bg-lp-lilas-3 rounded-2xl overflow-hidden py-6 gap-y-2">
        <View className=' h-12 flex flex-row items-center justify-between mb-3 border-b border-lp-blue mx-6'>
          <View className='w-8 h-8 px-6 border-r border-lp-blue flex items-center justify-center'>
            <Image source={require('../../../assets/images/credentials/search-icon.png')} className="w-6 h-6" />
          </View>
          <TextInput
            style={{ fontFamily: 'Montserrat-Regular' }}
            placeholder="Busque por seus apps salvos"
            className="text-lp-blue w-full h-full text-xs mx-2"
            placeholderTextColor="#03045E"
            onChangeText={handleChangeText}
          />
        </View>
        
        <FlatList
          showsVerticalScrollIndicator={true}
          data={credentials}
          keyExtractor={(item) => item.credential_slug}
          renderItem={renderItem}
          className='w-full'
          ListEmptyComponent={
            <Text className="text-center text-lp-blue text-sm font-montserrat-light mt-4" style={{ fontFamily: 'Montserrat-Regular' }}  >
              Nenhuma credencial cadastrada.
            </Text>
          }
        />
        <View className="w-full items-center justify-center py-2">
          <Link href="/(tabs)/auth/CreateCredential">
            <Text className="text-lp-blue text-sm underline" style={{ fontFamily: 'Montserrat-Regular' }}>
              Adicionar nova credencial
            </Text>
          </Link>
        </View>
        
      </View>
    </View>
  );
}
