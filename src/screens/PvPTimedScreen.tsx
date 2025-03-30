import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const iconSources = {
  Rock: require('../../assets/pixelRockGame.png'),
  Paper: require('../../assets/pixelPaperGame.png'),
  Scissors: require('../../assets/pixelScissorsGame.png'),
};

const choices = ['Rock', 'Paper', 'Scissors'] as const;

export default function PvPTimedScreen(): JSX.Element {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [sequenceRunning, setSequenceRunning] = useState(false);
  const [animationScale] = useState(new Animated.Value(1));
  const [label, setLabel] = useState(choices[0]);

  // Start animation loop
  useEffect(() => {
    if (!sequenceRunning) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => {
        const next = (prev + 1) % choices.length;
        setLabel(choices[next]);
        return next;
      });

      // Animate scale
      Animated.sequence([
        Animated.timing(animationScale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animationScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300); // faster cycle

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setSequenceRunning(false);
    }, 5000); 

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [sequenceRunning]);

  const startSequence = () => {
    setCurrentFrame(0);
    setSequenceRunning(true);
  };

  const currentChoice = choices[currentFrame];
  const icon = iconSources[currentChoice];

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#ff7173', '#cdecfb', '#63c4f1']}
        className="absolute w-full h-full"
      />

      <View className="flex-1 justify-center items-center px-4">
        {/* Title */}
        <Text style={titleStyle}>CLASH</Text>
        <Text style={subtitleStyle}>OF</Text>
        <Text style={footerTitleStyle}>HANDS</Text>

        {/* Animated Icon */}
        {sequenceRunning && (
          <View className="items-center mt-12">
            <Animated.Image
              source={icon}
              style={{
                width: 140,
                height: 140,
                transform: [{ scale: animationScale }],
              }}
              resizeMode="contain"
            />
            <Text style={labelStyle}>{label}</Text>
          </View>
        )}

        {/* Start Button */}
        {!sequenceRunning && (
          <TouchableOpacity
            onPress={startSequence}
            className="bg-[#63c4f1] border-4 border-[#f4d5a6] px-10 py-4 rounded-full mt-16"
          >
            <Text style={{ fontFamily: 'ByteBounce', fontSize: 24, color: '#000' }}>
              Start Round
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const titleStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 70,
  color: '#ff7072',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
};

const subtitleStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 40,
  color: '#000',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};

const footerTitleStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 70,
  color: '#e5aa7a',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
};

const labelStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 30,
  marginTop: 10,
  color: '#000',
  textShadowColor: '#ffffff99',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};
