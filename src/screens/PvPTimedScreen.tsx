import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const iconSources = {
  Rock: require('../../assets/pixelRockGame.png'),
  Paper: require('../../assets/pixelPaperGame.png'),
  Scissors: require('../../assets/pixelScissorsGame.png'),
};

const choices = ['Rock', 'Paper', 'Scissors'] as const;

export default function PvPTimedScreen(): JSX.Element {
  const [gameTimer, setGameTimer] = useState(60);
  const [round, setRound] = useState(1);
  const [player1Choice, setPlayer1Choice] = useState<string | null>(null);
  const [player2Choice, setPlayer2Choice] = useState<string | null>(null);
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
  const [turnTimer, setTurnTimer] = useState(10);
  const [sequenceRunning, setSequenceRunning] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationScale] = useState(new Animated.Value(1));
  const [label, setLabel] = useState(choices[0]);
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ p1: 0, p2: 0 });

  useEffect(() => {
    if (player1Choice && player2Choice) {
      startSequence();
    }
  }, [player1Choice, player2Choice]);

  useEffect(() => {
    if (!sequenceRunning) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = (prev + 1) % choices.length;
        setLabel(choices[next]);
        return next;
      });

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
    }, 300);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      handleRoundEnd();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [sequenceRunning]);

  useEffect(() => {
    if (sequenceRunning) return;

    const timer = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sequenceRunning, isPlayer1Turn]);

  const handleTimeout = () => {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    if (isPlayer1Turn) {
      setPlayer1Choice(randomChoice);
      setIsPlayer1Turn(false);
    } else {
      setPlayer2Choice(randomChoice);
    }
  };

  const startSequence = () => {
    setSequenceRunning(true);
    setGameTimer((prev) => prev - 5);
  };

  const handleRoundEnd = () => {
    const winner = getWinner(player1Choice!, player2Choice!);
    let resultText = 'Draw!';
    const newScore = { ...score };

    if (winner === 'Player 1') {
      resultText = 'Player 1 Wins!';
      newScore.p1 += 1;
    } else if (winner === 'Player 2') {
      resultText = 'Player 2 Wins!';
      newScore.p2 += 1;
    }

    setScore(newScore);
    setResult(resultText);
    setSequenceRunning(false);

    setTimeout(() => {
      if (gameTimer <= 0) return;
      setRound((r) => r + 1);
      setResult('');
      setPlayer1Choice(null);
      setPlayer2Choice(null);
      setIsPlayer1Turn(true);
      setTurnTimer(10);
    }, 3000);
  };

  const getWinner = (p1: string, p2: string) => {
    if (p1 === p2) return 'Draw';
    if (
      (p1 === 'Rock' && p2 === 'Scissors') ||
      (p1 === 'Paper' && p2 === 'Rock') ||
      (p1 === 'Scissors' && p2 === 'Paper')
    ) {
      return 'Player 1';
    }
    return 'Player 2';
  };

  const handleChoice = (choice: string) => {
    if (sequenceRunning) return;
    if (isPlayer1Turn) {
      setPlayer1Choice(choice);
      setIsPlayer1Turn(false);
    } else {
      setPlayer2Choice(choice);
    }
  };

  const currentChoice = choices[currentFrame];
  const icon = iconSources[currentChoice];

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#ff7173', '#cdecfb', '#63c4f1']}
        className="absolute w-full h-full"
      />

      <View className="flex-1 items-center justify-start pt-24 px-4">
        {/* Title */}
        <Text style={titleStyle}>CLASH</Text>
        <Text style={subtitleStyle}>OF</Text>
        <Text style={footerTitleStyle}>HANDS</Text>

        {/* Scoreboard */}
        <View className="flex-row justify-between items-center w-full max-w-[320px] mt-6 mb-2">
          <Text style={scoreStyle}>P1: {score.p1}</Text>
          <Text style={roundStyle}>⏱ {gameTimer}s | Round {round}</Text>
          <Text style={scoreStyle}>P2: {score.p2}</Text>
        </View>

        {/* Game Info */}
        <Text style={infoText}>
          {result
            ? result
            : isPlayer1Turn
            ? `Player 1's Turn (${turnTimer}s)`
            : `Player 2's Turn (${turnTimer}s)`}
        </Text>

        {/* Sequence / Choices */}
        {sequenceRunning ? (
          <View className="items-center mt-10">
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
        ) : (
          <View className="flex-row justify-between space-x-4 mt-10">
            {choices.map((choice) => (
              <TouchableOpacity
                key={choice}
                onPress={() => handleChoice(choice)}
              >
                <Image
                  source={iconSources[choice]}
                  style={{ width: 90, height: 90 }}
                  resizeMode="contain"
                />
                <Text style={labelStyle}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// Styles
const titleStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 60,
  color: '#ff7072',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
};

const subtitleStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 36,
  color: '#000',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};

const footerTitleStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 60,
  color: '#e5aa7a',
  textAlign: 'center',
  textShadowColor: '#000000aa',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
};

const scoreStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 22,
  color: '#000',
};

const roundStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 20,
  color: '#000',
};

const infoText = {
  fontFamily: 'ByteBounce',
  fontSize: 22,
  color: '#000',
  marginTop: 8,
  textAlign: 'center',
};

const labelStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 22,
  marginTop: 6,
  color: '#000',
  textAlign: 'center',
};
