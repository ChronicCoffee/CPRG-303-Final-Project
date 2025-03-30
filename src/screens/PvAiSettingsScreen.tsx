import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const iconSources = [
  require('../../assets/pixelRock.png'),
  require('../../assets/pixelPaper.png'),
  require('../../assets/pixelScissors.png'),
];

export default function PvAiSettingsScreen(): JSX.Element {
  const navigation = useNavigation();
  const [aiDifficulty, setAiDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);
  const [gameMode, setGameMode] = useState<'Timed' | 'BestOf3' | null>(null);

  const pixelArtImages = useMemo(() => {
    const items = [];
    for (let i = 0; i < 40; i++) {
      const size = 40 + Math.random() * 60;
      const top = Math.random() * (height - size - 100);
      const left = Math.random() * (width - size);
      const rotate = Math.floor(Math.random() * 360);
      const source = iconSources[Math.floor(Math.random() * iconSources.length)];
      items.push({ id: i, top, left, size, rotate, source });
    }
    return items;
  }, []);

  const colorMap = {
    Easy: '#22c55e',
    Medium: '#facc15',
    Hard: '#ef4444',
  };

  const modeColorMap = {
    Timed: '#3b82f6',
    BestOf3: '#a855f7',
  };

  const isReady = aiDifficulty && gameMode;

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#ff7173', '#cdecfb', '#63c4f1']}
        className="absolute w-full h-full"
      />

      {pixelArtImages.map(({ id, top, left, size, rotate, source }) => (
        <Image
          key={id}
          source={source}
          style={{
            position: 'absolute',
            top,
            left,
            width: size,
            height: size,
            opacity: 0.6,
            transform: [{ rotate: `${rotate}deg` }],
          }}
          resizeMode="contain"
        />
      ))}

      <View className="flex-1 items-center justify-start pt-36 px-4">
        {/* Title */}
        <View className="items-center mb-12">
          <Text style={titleStyle}>CLASH</Text>
          <Text style={subtitleStyle}>OF</Text>
          <Text style={footerTitleStyle}>HANDS</Text>
        </View>

        {/* Settings Card */}
        <View
          className="w-full max-w-[380px] bg-[#82cfff] rounded-2xl border-4 border-[#f4d5a6] p-6"
          style={{ height: height * 0.5 }}
        >
          <View className="flex-1 justify-between items-center">

            {/* AI Difficulty */}
            <Text style={sectionTitle}>AI Difficulty</Text>
            <View className="flex-row flex-wrap justify-center items-center gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map(level => {
                const isSelected = aiDifficulty === level;
                return (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setAiDifficulty(level)}
                    style={{
                      paddingVertical: Platform.OS === 'android' ? 8 : 10,
                      paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: colorMap[level],
                      backgroundColor: isSelected ? colorMap[level] : '#fff',
                      marginHorizontal: 6,
                    }}
                  >
                    <Text style={{
                      fontFamily: 'Bytebounce',
                      fontSize: 22,
                      color: isSelected ? '#fff' : colorMap[level],
                    }}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Game Mode */}
            <Text style={sectionTitle}>Game Mode</Text>
            <View className="flex-row flex-wrap justify-center items-center gap-2">
              {(['Timed', 'BestOf3'] as const).map(mode => {
                const isSelected = gameMode === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setGameMode(mode)}
                    style={{
                      paddingVertical: Platform.OS === 'android' ? 8 : 10,
                      paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: modeColorMap[mode],
                      backgroundColor: isSelected ? modeColorMap[mode] : '#fff',
                      marginHorizontal: 6,
                    }}
                  >
                    <Text style={{
                      fontFamily: 'Bytebounce',
                      fontSize: 22,
                      color: isSelected ? '#fff' : modeColorMap[mode],
                    }}>
                      {mode === 'Timed' ? '⏱ Timed' : '📊 Best of 3'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-center items-center mt-2 space-x-4">
              <TouchableOpacity
                className="bg-[#c6e8ff] rounded-xl py-3 px-8 items-center shadow"
                onPress={() => navigation.goBack()}
              >
                <Text style={{ fontFamily: 'Bytebounce', fontSize: 22, color: '#000' }}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!isReady}
                className="rounded-xl py-3 px-8 items-center shadow"
                style={{
                  backgroundColor: isReady ? '#63c4f1' : '#9ecfe8',
                  borderColor: '#eecfb3',
                  borderWidth: 4,
                  opacity: isReady ? 1 : 0.6,
                }}
                onPress={() => {
                  navigation.navigate('PvAIScreen', { difficulty: aiDifficulty, mode: gameMode});
                }}
              >
                <Text style={{ fontFamily: 'Bytebounce', fontSize: 22, color: '#000' }}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// Text styles
const titleStyle = {
  fontFamily: 'Bytebounce',
  fontSize: 100,
  color: '#ff7072',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
};

const subtitleStyle = {
  fontFamily: 'Bytebounce',
  fontSize: 48,
  color: '#000',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};

const footerTitleStyle = {
  fontFamily: 'Bytebounce',
  fontSize: 100,
  color: '#e5aa7a',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
};

const sectionTitle = {
  fontFamily: 'Bytebounce',
  fontSize: 35,
  color: '#fff',
  textShadowColor: '#00000066',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
  marginBottom: 8,
  textAlign: 'center',
};
