import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const iconSources = [
  require('../../assets/pixelRock.png'),
  require('../../assets/pixelPaper.png'),
  require('../../assets/pixelScissors.png'),
];

export default function HowToPlayScreen(): JSX.Element {
  const navigation = useNavigation();

  const pixelArtImages = useMemo(() => {
    const items = [];
    for (let i = 0; i < 35; i++) {
      const size = 40 + Math.random() * 60;
      const top = Math.random() * (height - size - 100);
      const left = Math.random() * (width - size);
      const rotate = Math.floor(Math.random() * 360);
      const source = iconSources[Math.floor(Math.random() * iconSources.length)];
      items.push({ id: i, top, left, size, rotate, source });
    }
    return items;
  }, []);

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
            opacity: 0.4,
            transform: [{ rotate: `${rotate}deg` }],
          }}
          resizeMode="contain"
        />
      ))}

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 100, paddingBottom: 80 }}>
        {/* Title */}
        <Text
          style={{
            fontFamily: 'ByteBounce',
            fontSize: 50,
            color: '#fff',
            textAlign: 'center',
            textShadowColor: '#000',
            textShadowOffset: { width: 3, height: 3 },
            textShadowRadius: 2,
            marginBottom: 24,
          }}
        >
          HOW TO PLAY
        </Text>

        {/* Sections */}
        <View className="bg-[#82cfff] border-4 border-[#f4d5a6] rounded-2xl p-5 mb-6 shadow">
          <Text style={sectionTitle}>🕹️ Basic Rules</Text>
          <Text style={sectionText}>
            Rock beats Scissors{'\n'}
            Scissors beats Paper{'\n'}
            Paper beats Rock
          </Text>
        </View>

        <View className="bg-[#bde6ff] border-4 border-[#eecfb3] rounded-2xl p-5 mb-6 shadow">
          <Text style={sectionTitle}>⏱️ Timed Mode</Text>
          <Text style={sectionText}>
            Unlimited rounds — whoever has the most wins when the timer ends, wins!
          </Text>
        </View>

        <View className="bg-[#bde6ff] border-4 border-[#eecfb3] rounded-2xl p-5 mb-6 shadow">
          <Text style={sectionTitle}>🏆 Best of 3</Text>
          <Text style={sectionText}>
            First player to win 2 out of 3 rounds wins the match.
          </Text>
        </View>

        <View className="bg-[#c6e8ff] border-4 border-[#f4d5a6] rounded-2xl p-5 mb-6 shadow">
          <Text style={sectionTitle}>🎮 Navigation</Text>
          <Text style={sectionText}>
            • Tap <Text className="text-[#63c4f1]">Start Game</Text> on the Home Screen{'\n'}
            • Choose Player vs Player or Player vs AI{'\n'}
            • Customize your game mode and start battling!
          </Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          className="bg-[#c6e8ff] border-4 border-[#f4d5a6] rounded-xl px-10 py-4 items-center self-center shadow"
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontFamily: 'ByteBounce', fontSize: 22, color: '#000' }}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const sectionTitle = {
  fontFamily: 'ByteBounce',
  fontSize: 35,
  color: '#000',
  marginBottom: 8,
  textAlign: 'center',
  textShadowColor: '#fff',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};

const sectionText = {
  fontFamily: 'ByteBounce',
  fontSize: 23,
  color: '#222',
  lineHeight: 30,
  textAlign: 'center',
};
