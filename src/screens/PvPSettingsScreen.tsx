import React, { useMemo } from 'react';
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

  const pixelArtImages = useMemo(() => {
    const items: { id: number; top: number; left: number; size: number; rotate: number; source: any; }[] = [];
    const attempts = 100;
    
    const isOverlapping = (a: { id?: number; top: any; left: any; size: any; rotate?: number; source?: any; }, b: { id?: number; top: any; left: any; size: any; rotate?: number; source?: any; }) => {
      return !(
        a.left + a.size < b.left ||
        a.left > b.left + b.size ||
        a.top + a.size < b.top ||
        a.top > b.top + b.size
      );
    };

    for (let i = 0; i < 40 && attempts > 0; i++) {
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
          <Text style={{
            fontFamily: 'ByteBounce',
            fontSize: 100,
            color: '#ff7072',
            textAlign: 'center',
            textShadowColor: '#000000aa',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
          }}>
            CLASH
          </Text>
          <Text style={{
            fontFamily: 'ByteBounce',
            fontSize: 48,
            color: '#000',
            textAlign: 'center',
            textShadowColor: '#000000aa',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1,
          }}>
            OF
          </Text>
          <Text style={{
            fontFamily: 'ByteBounce',
            fontSize: 100,
            color: '#e5aa7a',
            textAlign: 'center',
            textShadowColor: '#000000aa',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
          }}>
            HANDS
          </Text>
        </View>

        {/* Settings Card */}
        <View
          className="w-full max-w-[380px] bg-[#82cfff] rounded-2xl border-4 border-[#f4d5a6] p-6"
          style={{ height: height * 0.5 }}
        >
          <View className="flex-1 justify-between items-center">

            <Text style={{
              fontFamily: 'ByteBounce',
              fontSize: 35,
              color: '#fff',
              textShadowColor: '#00000066',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 2,
              textAlign: 'center',
            }}>
              Mode Settings
            </Text>

            {/* Timed Mode */}
            <TouchableOpacity className="bg-[#bde6ff] rounded-xl p-4 w-full shadow flex-row items-center justify-center space-x-2">
              <Clock size={20} color="black" style={{ marginRight: 8 }} />
              <Text style={{ fontFamily: 'ByteBounce', fontSize: 30, color: '#000' }}>Timed</Text>
            </TouchableOpacity>

            {/* Best of 3 */}
            <TouchableOpacity className="bg-[#bde6ff] rounded-xl p-4 w-full shadow flex-row items-center justify-center space-x-2">
              <Text style={{ fontFamily: 'ByteBounce', fontSize: 30, color: '#000' }}>📊 Best of 3</Text>
            </TouchableOpacity>

            {/* Back */}
            <TouchableOpacity
              className="bg-[#c6e8ff] rounded-xl py-4 px-12 items-center shadow"
              onPress={() => navigation.goBack()}
            >
              <Text style={{ fontFamily: 'ByteBounce', fontSize: 22, color: '#000000' }}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
