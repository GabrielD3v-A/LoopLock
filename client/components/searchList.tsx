import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Text, View, Image } from 'react-native';

interface ResultItem {
  credential_name: string;
  credential_slug: string;
}

interface SearchListProps {
  results: ResultItem[];
}

const SearchList: React.FC<SearchListProps> = ({ results }) => {
  

  const credentialIcons: Record<string, any> = {
    github: require('../assets/images/credentials/github.png'),
    discord: require('../assets/images/credentials/discord.png'),
    spotify: require('../assets/images/credentials/spotify.png'),
    // Adicione mais aqui conforme necessário
  };

  const getCredentialIcon = (iconName: string | null) => {
    if (iconName && credentialIcons[iconName]) {
      return credentialIcons[iconName];
    }
    return require('../assets/images/credentials/template.png');
  };

  return (
    <View className="absolute top-24 left-0 right-0 bg-white z-10 w-full h-3/4 px-8 flex-1  flex items-center justify-center ">
      <View className="w-full bg-transparent flex items-center justify-center mb-4">
        <Text className="text-lp-blue text-lg font-montserrat-bold">Resultados da Busca</Text>
      </View>
      <View className='w-full h-5/6 bg-lp-lilas-3 rounded-2xl overflow-hidden px-1 py-6 gap-y-2'> 
        <FlatList
          showsVerticalScrollIndicator={true}
          data={results}
          keyExtractor={(item) => item.credential_slug}
          renderItem={({ item }) => (
            <View className="px-4 py-2 bg-lp-lilas mb-2 rounded-full text-xs flex flex-row items-center justify-between mx-4">
              <View className="flex flex-row items-center">
                <Image
                  source={require('../assets/images/credentials/template.png')}
                  className="w-9 h-9 rounded-full mr-2"
                />
                <View className="flex flex-col items-start">
                  <Text className="text-lp-blue text-sm font-montserrat-bold">{item.credential_name}</Text>
                  <Text className="text-lp-blue-2 text-xs font-montserrat-light">{item.credential_name}</Text>
                </View>
              </View>
              <Image
                source={require('../assets/images/icons/arrow.png')}
                className="w-6 h-6 ml-2"
              />
            </View>
          )}
        />
        <View className="w-full bg-transparent flex items-center justify-center ">
          <Text className="text-lp-lilas text-sm font-montserrat-bold underline">
            {results.length === 0 ? 'Nenhum resultado encontrado' : 'Exibindos resultados'} 
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SearchList;
