import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native'; 

const { width, height } = Dimensions.get('window');

const iconSources = [
  require('../../assets/pixelRock.png'),
  require('../../assets/pixelPaper.png'),
  require('../../assets/pixelScissors.png'),
];

export default function HomeScreen(): JSX.Element {
  const navigation = useNavigation(); 

  const pixelArtImages = useMemo(() => {
    const items: { id: number; top: number; left: number; size: number; rotate: number; source: any }[] = [];
    const attempts = 100;

    const isOverlapping = (a: { id?: number; top: any; left: any; size: any; rotate?: number; source?: any; }, b: { id?: number; top: any; left: any; size: any; rotate?: number; source?: any; }) => {
      return !(
        a.left + a.size < b.left ||
        a.left > b.left + b.size ||
        a.top + a.size < b.top ||
        a.top > b.top + b.size
      );
    };

    for (let i = 0; i < 35 && attempts > 0; i++) {
      let tries = 0;
      while (tries < attempts) {
        const size = 40 + Math.random() * 60;
        const top = Math.random() * (height - size - 100);
        const left = Math.random() * (width - size);
        const rotate = Math.floor(Math.random() * 360);
        const source = iconSources[Math.floor(Math.random() * iconSources.length)];

        const newItem = { id: i, top, left, size, rotate, source };

        const collision = items.some(existing => isOverlapping(existing, newItem));
        if (!collision) {
          items.push(newItem);
          break;
        }
        tries++;
      }
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

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center" style={{ marginBottom: 200 }}>
          <Text
            style={{
              fontFamily: 'ByteBounce',
              fontSize: 100,
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
              fontFamily: 'ByteBounce',
              fontSize: 55,
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
              fontFamily: 'ByteBounce',
              fontSize: 100,
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
          style={{ marginBottom: 40 }}
          onPress={() => navigation.navigate('GameMode')} 
        >
          <Text
            style={{
              fontFamily: 'ByteBounce',
              fontSize: 38,
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