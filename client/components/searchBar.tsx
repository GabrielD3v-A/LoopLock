import React from 'react';
import { StyleSheet, TextInput, View, Image } from 'react-native';

const SearchBar = () => {
    return (
        <View className='flex flex-row items-center justify-between w-full px-2 py-1 bg-[#CBCCF5] rounded-full  border-white box-border' style={{ height: 40, borderWidth: 1, borderColor: '#fff' }}>
            <Image source={require('../assets/images/icons/search-icon.png')} style={{ width: 22, height: 22 }} />
            <TextInput placeholder="" className='h-full w-full bg-transparent text-white px-2' placeholderTextColor={'#fff'}  multiline={true} maxLength={100}/>
        </View>
    );
}

const styles = StyleSheet.create({})

export default SearchBar;
