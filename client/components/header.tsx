import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Logo from './logo';
import SearchBar from './searchBar';

const Header = () => {              
    const [searchQuery, setSearchQuery] = React.useState('');

    return (
        <View  className='fixed w-screen h-24 top-0 left-0 bg-lp-blue flex flex-row items-center justify-between px-4  z-10 py-2 rounded-b-3xl box-content'>
            <View className='flex items-center'>
                <Logo />
            </View>
            <View className='flex flex-row items-center justify-between w-auto h-full gap-x-2'>
                <SearchBar />
                <Image source={require('@/assets/images/icons/user-icon.png')} className='w-12 h-12' />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Header;
