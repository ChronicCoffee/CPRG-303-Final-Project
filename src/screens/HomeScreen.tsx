import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Settings } from 'lucide-react-native'; 

export default function HomeScreen(): JSX.Element {
  const pixelArtImages = [
    { id: 1, s: 'top-[634px] left-3 w-[52px] h-[53px]' },
    { id: 22, s: 'top-[283px] left-[-61px] w-[35px] h-[37px]' },
    { id: 9, s: 'top-[89px] left-[19px] w-[54px] h-[53px]' },
    { id: 20, s: 'top-0 left-[168px] w-[37px] h-10' },
    { id: 17, s: 'top-0 left-[210px] w-[58px] h-[58px]' },
    { id: 7, s: 'top-[63px] left-0 w-[53px] h-[53px]' },
    { id: 21, s: 'top-0 left-[278px] w-[55px] h-14' },
    { id: 5, s: 'top-[3px] left-[92px] w-[58px] h-[58px]' },
    { id: 10, s: 'top-[77px] left-[268px] w-[61px] h-[60px]' },
    { id: 23, s: 'top-[45px] left-0 w-[23px] h-[53px]' },
    { id: 28, s: 'top-0 left-[18px] w-[58px] h-[58px]' },
    { id: 41, s: 'top-[81px] left-[19px] w-16 h-[65px]' },
    { id: 36, s: 'top-[118px] left-0 w-[3px] h-[41px]' },
    { id: 6, s: 'top-[473px] left-[232px] w-[53px] h-[53px]' },
    { id: 24, s: 'top-0 left-0 w-[53px] h-[53px]' },
    { id: 32, s: 'top-0 left-[90px] w-[55px] h-14' },
    { id: 38, s: 'top-0 left-[25px] w-[61px] h-[60px]' },
    { id: 14, s: 'top-[425px] left-[97px] w-[53px] h-[53px]' },
    { id: 26, s: 'top-[22px] left-0 w-[11px] h-[53px]' },
    { id: 27, s: 'top-[153px] left-[-53px] w-[35px] h-[37px]' },
    { id: 42, s: 'top-[760px] left-[5px] w-[58px] h-[58px]' },
    { id: 18, s: 'top-[473px] left-[17px] w-[41px] h-[41px]' },
    { id: 29, s: 'top-[74px] left-[-78px] w-[38px] h-[38px]' },
    { id: 31, s: 'top-3 left-[22px] w-[58px] h-[57px]' },
    { id: 34, s: 'top-0 left-0 w-[33px] h-[58px]' },
    { id: 15, s: 'top-[404px] left-[194px] w-[58px] h-[58px]' },
    { id: 33, s: 'top-[34px] left-[31px] w-[58px] h-[58px]' },
    { id: 13, s: 'top-[409px] left-[283px] w-[61px] h-[60px]' },
    { id: 40, s: 'top-[358px] left-[35px] w-[46px] h-[49px]' },
    { id: 8, s: 'top-[829px] left-[53px] w-11 h-[31px]' },
    { id: 16, s: 'top-0 left-0 w-[58px] h-[57px]' },
    { id: 3, s: 'top-[37px] left-[53px] w-[67px] h-[67px]' },
  ];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="bg-white flex-1 items-center justify-start">
        <View className="relative w-[393px] h-[860px] bg-white overflow-hidden">
          
          {/* Pixel Art Images */}
          {pixelArtImages.map(({ id, s }) => (
            <Image
              key={id}
              className={`absolute ${s}`}
              source={require('../../assets/pixelRock.png')} 
              resizeMode="contain"
            />
          ))}

          {/* Game Title */}
          <View className="absolute top-12 left-[94px] w-[238px] h-[355px] items-center justify-center">
            <Text className="text-6xl font-extrabold text-[#ff7072] text-center">CLASH</Text>
            <Text className="text-4xl font-extrabold text-black text-center">OF</Text>
            <Text className="text-6xl font-extrabold text-[#e5aa7a] text-center">HANDS</Text>
          </View>

          {/* Start Game Button */}
          <TouchableOpacity className="absolute top-[605px] left-[56px] w-[239px] h-[53px] bg-[#63c4f1] border-4 border-[#eecfb3] rounded-full shadow items-center justify-center">
            <Text className="text-black text-[32px] font-bold">Start Game</Text>
          </TouchableOpacity>

          {/* Settings Button */}
          <TouchableOpacity className="absolute top-[772px] left-[177px] w-14 h-[53px] bg-[#63c4f1] border-4 border-[#eecfb3] rounded-full shadow items-center justify-center">
            <Settings color="black" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
