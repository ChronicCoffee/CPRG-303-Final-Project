import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Clock } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const iconSources = [
  require('../../assets/pixelRock.png'),
  require('../../assets/pixelPaper.png'),
  require('../../assets/pixelScissors.png'),
];

export default function PvPSettingsScreen(): JSX.Element {
  const navigation = useNavigation();
  const [gameMode, setGameMode] = useState<'Timed' | 'BestOf3'>('Timed');

  const pixelArtImages = useMemo(() => {
    const items: { id: number; top: number; left: number; size: number; rotate: number; source: any }[] = [];
    const maxIcons = 60;
    const maxTriesPerIcon = 100;
  
    const isOverlapping = (a: any, b: any) => {
      return !(
        a.left + a.size < b.left ||
        a.left > b.left + b.size ||
        a.top + a.size < b.top ||
        a.top > b.top + b.size
      );
    };
  
    for (let i = 0; i < maxIcons; i++) {
      let tries = 0;
      while (tries < maxTriesPerIcon) {
        const size = 40 + Math.random() * 60;
        const top = Math.random() * (height - size - 100);
        const left = Math.random() * (width - size);
        const rotate = Math.floor(Math.random() * 360);
        const source = iconSources[Math.floor(Math.random() * iconSources.length)];
  
        const newItem = { id: i, top, left, size, rotate, source };
        const hasCollision = items.some(existing => isOverlapping(existing, newItem));
  
        if (!hasCollision) {
          items.push(newItem);
          break;
        }
  
        tries++;
      }
    }
  
    return items;
  }, []);  

  const modeColorMap = {
    Timed: '#3b82f6',
    BestOf3: '#a855f7',
  };

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
          className="w-full max-w-[380px] bg-[#82cfff] rounded-2xl border-4 border-[#f4d5a6] p-8"
          style={{ height: height * 0.5 }}
        >
          <View className="flex-1 justify-between items-center">
            <Text style={sectionTitle}>Mode Settings</Text>

            {/* Game Mode Selection */}
            <TouchableOpacity
              onPress={() => setGameMode('Timed')}
              className="w-full mb-4 rounded-xl p-4 shadow"
              style={{
                backgroundColor: gameMode === 'Timed' ? modeColorMap.Timed : '#ffffff',
                borderWidth: 2,
                borderColor: modeColorMap.Timed,
              }}
            >
              <View className="flex-row justify-center items-center">
                <Clock size={24} color={gameMode === 'Timed' ? '#fff' : modeColorMap.Timed} style={{ marginRight: 8 }} />
                <Text
                  style={{
                    fontFamily: 'ByteBounce',
                    fontSize: 30,
                    color: gameMode === 'Timed' ? '#fff' : modeColorMap.Timed,
                  }}
                >
                  Timed Mode
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setGameMode('BestOf3')}
              className="w-full mb-4 rounded-xl p-4 shadow"
              style={{
                backgroundColor: gameMode === 'BestOf3' ? modeColorMap.BestOf3 : '#ffffff',
                borderWidth: 2,
                borderColor: modeColorMap.BestOf3,
              }}
            >
              <Text
                style={{
                  fontFamily: 'ByteBounce',
                  fontSize: 30,
                  color: gameMode === 'BestOf3' ? '#fff' : modeColorMap.BestOf3,
                  textAlign: 'center',
                }}
              >
                📊 Best of 3
              </Text>
            </TouchableOpacity>

            {/* Bottom Buttons */}
            <View className="flex-row justify-center items-center mt-2 space-x-4">
              <TouchableOpacity
                className="bg-[#c6e8ff] rounded-xl py-3 px-10  shadow"
                onPress={() => navigation.goBack()}
              >
                <Text style={{ fontFamily: 'ByteBounce', fontSize: 22, color: '#000000' }}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-[#63c4f1] rounded-xl py-3 px-10 shadow border-4 border-[#f4d5a6]"
                onPress={() => { if (gameMode === 'Timed') {
                  navigation.navigate('PvPTimed'); } else if (gameMode === 'BestOf3') { navigation.navigate('PvPBestOf3'); }
                }}
              >
                <Text style={{ fontFamily: 'ByteBounce', fontSize: 22, color: '#000000' }}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const titleStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 100,
  color: '#ff7072',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
};
const subtitleStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 48,
  color: '#000',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};
const footerTitleStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 100,
  color: '#e5aa7a',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
};
const sectionTitle = {
  fontFamily: 'ByteBounce',
  fontSize: 35,
  color: '#fff',
  textShadowColor: '#00000066',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
  textAlign: 'center',
};
