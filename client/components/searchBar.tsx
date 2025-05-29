import React, { useRef, useEffect, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { TextInput, View, Image, Keyboard, KeyboardEvent } from 'react-native';

const SearchBar = () => {
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState('');

  // Remove o foco quando o teclado é fechado
  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current?.blur();
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  const handleChangeText = (value: string) => {
    setText(value);
    if (value.trim() === '') {
      inputRef.current?.blur();
      Keyboard.dismiss();
    }
  };

  const handleSubmit = () => {
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <TouchableWithoutFeedback onPress={handleFocus}>
        <View className="flex flex-row items-center rounded-full border border-white box-border w-48 h-12 px-2 bg-lp-lilas">
            <Image source={require('../assets/images/icons/search-icon.png')} className="w-6 h-6" />
            <TextInput
                ref={inputRef}
                placeholder=""
                className="text-white w-10/12 h-full text-xs "
                placeholderTextColor="#fff"
                multiline={false}
                value={text}
                onChangeText={handleChangeText}
                onSubmitEditing={handleSubmit}
            />
        </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchBar;
