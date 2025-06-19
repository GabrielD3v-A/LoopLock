import React, { useRef, useEffect, useState } from 'react';
import { TextInput, View, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store'; // ao invés de AsyncStorage

interface SearchBarProps {
  onResults: (results: any[]) => void;
  onToggleSearchList: (visible: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onResults, onToggleSearchList }) => {
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState('');
  const [allCredentials, setAllCredentials] = useState<any[]>([]);

  useEffect(() => {
    const fetchStoredCredentials = async () => {
      const creds = await getStoredCredentials();
      setAllCredentials(creds);
    };

    const getStoredCredentials = async (): Promise<any[]> => {
      try {
        const stored = await SecureStore.getItemAsync('credentials');
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Erro ao buscar credenciais no SecureStore', error);
        return [];
      }
    };

    fetchStoredCredentials();

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current?.blur();
    });

    return () => hideSubscription.remove();
  }, []);

  const handleChangeText = (value: string) => {
    setText(value);

    const searchText = value.trim().toLowerCase();

    if (searchText === '') {
      onToggleSearchList(false);
      onResults([]);
      return;
    }

    const filtered = allCredentials.filter((credential) =>
      credential.credential_name.toLowerCase().includes(searchText)
    );

    onResults(filtered);
    onToggleSearchList(filtered.length > 0);
  };

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
      <View className="flex flex-row items-center rounded-full border border-white w-48 h-12 px-2 bg-lp-lilas">
        <Image
          source={require('../assets/images/icons/search-icon.png')}
          className="w-6 h-6"
        />
        <TextInput
          ref={inputRef}
          placeholder="Buscar..."
          className="text-white w-10/12 h-full text-xs"
          placeholderTextColor="#fff"
          value={text}
          onChangeText={handleChangeText}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchBar;
