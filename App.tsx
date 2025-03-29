import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    Bytebounce: require('./assets/fonts/ByteBounce.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#63c4f1" />
      </View>
    );
  }

  return <HomeScreen />;
}
