import React from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import GameModeScreen from "./src/screens/GameModeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import PvPSettingsScreen from "./src/screens/PvPSettingsScreen";
import PvAiSettingsScreen from "./src/screens/PvAiSettingsScreen";
import HowToPlayScreen from "./src/screens/HowtoPlayScreen";
import PvPTimedScreen from "./src/screens/PvPTimedScreen";
import PvAIScreen from "./src/screens/PvAIScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    ByteBounce: require("./assets/fonts/ByteBounce.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
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
        <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
        <Stack.Screen name="PvPTimed" component={PvPTimedScreen} />
        <Stack.Screen name="PvAIScreen" component={PvAIScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
