import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Logo from './logo';
import SearchBar from './searchBar';

const Header = () => {              
    const [searchQuery, setSearchQuery] = React.useState('');

    return (
        <View style={{ height: 80 }}  className='fixed w-full top-0 left-0 bg-lp-blue flex flex-row items-center justify-between px-4  z-10 py-10 rounded-b-3xl'>
            <View className='flex items-start justify-end w-1/2'>
                <Logo />
            </View>
            <View className='flex flex-row items-center justify-between w-1/2 gap-x-4'>
                <View className='w-40 h-5'><SearchBar /></View>
                <Image source={require('@/assets/images/icons/user-icon.png')} style={{ width: 40, height: 40 }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Header;
