import Header from '@/components/header';
import Menu from '@/components/menu';
import SearchList from '@/components/searchList';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { usePathname } from 'expo-router';

export default function AuthLayout() {
  const pathname = usePathname(); 
  const [results, setResults] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    // Reset results and visibility when the pathname changes
    setResults([]);
    setShowList(false);
  }, [pathname]);


  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-full h-full relative">
        <Header onResults={setResults} onToggleSearchList={(visible) => setShowList(visible)}/>

        {showList && <SearchList results={results} />}

        <Menu />
      </View>
    </SafeAreaView>
  );
}
