import React, { useRef, useEffect, useState } from 'react';
import { TextInput, View, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchBarProps {
  onResults: (results: any[]) => void;
  onToggleSearchList: (visible: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onResults, onToggleSearchList }) => {
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current?.blur();
    });
    return () => hideSubscription.remove();
  }, []);

    const handleChangeText = async (value: string) => {
      setText(value);

      const searchText = value.trim().toLowerCase();

      if (searchText === '') {
        onToggleSearchList(false);
        onResults([]); // limpa os resultados quando está vazio
        return false;
      }

      try {
        let stored = await AsyncStorage.getItem('search_data');

        if (!stored) {
          const response = await fetch('https://jsonplaceholder.typicode.com/users');
          const data = await response.json();
          await AsyncStorage.setItem('search_data', JSON.stringify(data));
          stored = JSON.stringify(data); // 👈 aqui você estava sobrescrevendo com string
        }

        const parsed = JSON.parse(stored);

        const filtered = parsed.filter((item: { name?: string }) =>
          item?.name?.toLowerCase().includes(searchText)
        );

        onResults(filtered);
        onToggleSearchList(true);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };



  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
      <View className="flex flex-row items-center rounded-full border border-white w-48 h-12 px-2 bg-lp-lilas">
        <Image source={require('../assets/images/icons/search-icon.png')} className="w-6 h-6" />
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
