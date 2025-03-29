import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen(): JSX.Element {
  
  const pixelArtImages = useMemo(() => {
    const items = [];
    for (let i = 0; i < 30; i++) {
      const randomTop = Math.random() * height * 0.9;
      const randomLeft = Math.random() * width * 0.9;
      const size = 32 + Math.random() * 24; 
      items.push({
        id: i,
        top: randomTop,
        left: randomLeft,
        size,
      });
    }
    return items;
  }, []);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#ff7173', '#cdecfb', '#63c4f1']}
        className="absolute w-full h-full"
      />

      {/* Pixel Art Background */}
      {pixelArtImages.map(({ id, top, left, size }) => (
        <Image
          key={id}
          source={require('../../assets/pixelRock.png')}
          style={{
            position: 'absolute',
            top,
            left,
            width: size,
            height: size,
            opacity: 0.3,
          }}
          resizeMode="contain"
        />
      ))}

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center mb-16">
          <Text
            style={{
              fontFamily: 'ByteBounce-Medium',
              fontSize: 48,
              textShadowColor: '#00000066',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 2,
              color: '#ff7072',
              textAlign: 'center',
            }}
          >
            CLASH
          </Text>
          <Text
            style={{
              fontFamily: 'ByteBounce-Medium',
              fontSize: 40,
              textShadowColor: '#00000066',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 2,
              color: '#000',
              textAlign: 'center',
            }}
          >
            OF
          </Text>
          <Text
            style={{
              fontFamily: 'ByteBounce-Medium',
              fontSize: 48,
              textShadowColor: '#00000066',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 2,
              color: '#e5aa7a',
              textAlign: 'center',
            }}
          >
            HANDS
          </Text>
        </View>

        {/* Start Game Button */}
        <TouchableOpacity
          className="bg-[#63c4f1] border-4 border-[#eecfb3] rounded-full px-8 py-3 shadow"
          style={{ marginBottom: 32 }}
        >
          <Text
            style={{
              fontFamily: 'ByteBounce-Medium',
              fontSize: 24,
              color: '#000',
            }}
          >
            Start Game
          </Text>
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity
          className="bg-[#63c4f1] border-4 border-[#eecfb3] rounded-full w-14 h-14 items-center justify-center shadow"
        >
          <Settings size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
