import React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import GameModeScreen from './src/screens/GameModeScreen';
import SettingsScreen from './src/screens/SettingsScreen'; 
import PvPSettingsScreen from './src/screens/PvPSettingsScreen'; 
import PvAiSettingsScreen from './src/screens/PvAiSettingsScreen';




const Stack = createNativeStackNavigator();

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

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GameMode" component={GameModeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="PvPSettings" component={PvPSettingsScreen} />
        <Stack.Screen name="PvAiSettings" component={PvAiSettingsScreen} />

        {/* Future Screens: PvP, PvAI, etc */}
        {/* <Stack.Screen name="PvP" component={PvPScreen} /> */}
        {/* <Stack.Screen name="PvAI" component={PvAIScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
