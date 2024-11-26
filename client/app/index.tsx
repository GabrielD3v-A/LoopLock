import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import '../assets/style/global.css';
export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-blue-500">
        <Text className="text-yellow-300 text-lg font-bold">Hello, Tailwind!</Text>
    </View>
  );
}
