import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const iconSources = {
  Rock: require('../../assets/pixelRockGame.png'),
  Paper: require('../../assets/pixelPaperGame.png'),
  Scissors: require('../../assets/pixelScissorsGame.png'),
};

const choices = ['Rock', 'Paper', 'Scissors'] as const;

export default function PvPTimedScreen(): JSX.Element {
  const navigation = useNavigation();
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
  const [gameOver, setGameOver] = useState(false);
  const [finalResult, setFinalResult] = useState('');

  useEffect(() => {
    if (player1Choice && player2Choice) startSequence();
  }, [player1Choice, player2Choice]);

  useEffect(() => {
    if (!sequenceRunning || gameOver) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = (prev + 1) % choices.length;
        setLabel(choices[next]);
        return next;
      });

      Animated.sequence([
        Animated.timing(animationScale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
        Animated.timing(animationScale, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    }, 300);

    const countdown = setInterval(() => {
      setGameTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setGameOver(true);
          evaluateFinalResult();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      clearInterval(countdown);
      handleRoundEnd();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      clearInterval(countdown);
    };
  }, [sequenceRunning]);

  useEffect(() => {
    if (sequenceRunning || gameOver) return;

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
  }, [sequenceRunning, isPlayer1Turn, gameOver]);

  const getWinner = (p1: string, p2: string) => {
    if (p1 === p2) return 'Draw';
    if ((p1 === 'Rock' && p2 === 'Scissors') || (p1 === 'Paper' && p2 === 'Rock') || (p1 === 'Scissors' && p2 === 'Paper')) {
      return 'Player 1';
    }
    return 'Player 2';
  };

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
      if (gameTimer <= 0) {
        setGameOver(true);
        evaluateFinalResult(newScore);
        return;
      }
      setRound((r) => r + 1);
      setResult('');
      setPlayer1Choice(null);
      setPlayer2Choice(null);
      setIsPlayer1Turn(true);
      setTurnTimer(10);
    }, 3000);
  };

  const evaluateFinalResult = (scores = score) => {
    const final =
      scores.p1 > scores.p2
        ? '🏆 Player 1 is the Winner!'
        : scores.p2 > scores.p1
        ? '🏆 Player 2 is the Winner!'
        : "🤝 It's a Tie!";
    setFinalResult(final);
  };

  const handleChoice = (choice: string) => {
    if (sequenceRunning || gameOver) return;
    if (isPlayer1Turn) {
      setPlayer1Choice(choice);
      setIsPlayer1Turn(false);
    } else {
      setPlayer2Choice(choice);
    }
  };

  const giveUp = () => {
    setGameOver(true);
    setFinalResult(isPlayer1Turn ? '🚩 Player 1 surrendered!' : '🚩 Player 2 surrendered!');
  };

  const playAgain = () => {
    navigation.goBack();
  };

  const currentChoice = choices[currentFrame];
  const icon = iconSources[currentChoice];

  return (
    <View className="flex-1">
      <LinearGradient colors={['#ff7173', '#cdecfb', '#63c4f1']} className="absolute w-full h-full" />
      <View className="flex-1 items-center justify-start pt-24 px-4">
        <Text style={titleStyle}>CLASH</Text>
        <Text style={subtitleStyle}>OF</Text>
        <Text style={footerTitleStyle}>HANDS</Text>

        {/* Scoreboard */}
        <View
          className="flex-row justify-between items-center w-full mt-6 mb-4 px-4 py-3"
          style={{
            backgroundColor: '#fdf5e6',
            borderColor: '#f4d5a6',
            borderWidth: 4,
            borderRadius: 16,
            maxWidth: 380,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={playerLabel}>👤 Player 1</Text>
            <Text style={scoreStyle}>Score: {score.p1}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={timerLabel}>🕹️ Round {round}</Text>
            <Text style={timerClock}>⏱️ {gameTimer}s</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={playerLabel}>Player 2 👤</Text>
            <Text style={scoreStyle}>Score: {score.p2}</Text>
          </View>
        </View>

        {/* Game Info */}
        {!sequenceRunning && !gameOver && !!result && <Text style={infoText}>{result}</Text>}
        {!sequenceRunning && !gameOver && !result && (
          <Text style={infoText}>
            {isPlayer1Turn
              ? `Player 1's Turn (${turnTimer}s)`
              : `Player 2's Turn (${turnTimer}s)`}
          </Text>
        )}
        {!!gameOver && <Text style={[infoText, { marginTop: 10 }]}>{finalResult}</Text>}

        {/* Game UI */}
        {sequenceRunning ? (
          <View className="items-center mt-10">
            <Animated.Image
              source={icon}
              style={{ width: 180, height: 180, transform: [{ scale: animationScale }] }}
              resizeMode="contain"
            />
            <Text style={labelStyle}>{label}</Text>
          </View>
        ) : (
          <View className="flex-row justify-between space-x-4 mt-14">
            {choices.map((choice) => (
              <TouchableOpacity key={choice} onPress={() => handleChoice(choice)}>
                <Image source={iconSources[choice]} style={{ width: 120, height: 120 }} resizeMode="contain" />
                <Text style={labelStyle}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Buttons */}
        {!gameOver && !sequenceRunning && (
          <TouchableOpacity
            onPress={giveUp}
            className="bg-red-300 mt-10 px-6 py-3 rounded-xl border-2 border-red-700"
          >
            <Text style={{ fontFamily: 'ByteBounce', fontSize: 25, color: '#000' }}>Give Up</Text>
          </TouchableOpacity>
        )}

        {gameOver && (
          <TouchableOpacity
            onPress={playAgain}
            className="bg-green-300 mt-10 px-8 py-4 rounded-xl border-2 border-green-600"
          >
            <Text style={{ fontFamily: 'ByteBounce', fontSize: 25, color: '#000' }}>Play Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// === STYLES ===
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
  fontSize: 50,
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

const scoreStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 22,
  color: '#000',
};

const playerLabel = {
  fontFamily: 'ByteBounce',
  fontSize:25,
  color: '#333',
};

const timerLabel = {
  fontFamily: 'ByteBounce',
  fontSize: 23,
  color: '#000',
};

const timerClock = {
  fontFamily: 'ByteBounce',
  fontSize: 31,
  color: '#111',
  textShadowColor: '#fff',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};

const infoText = {
  fontFamily: 'ByteBounce',
  fontSize: 38,
  color: '#000',
  marginTop: 8,
  textAlign: 'center',
};

const labelStyle = {
  fontFamily: 'ByteBounce',
  fontSize: 25,
  marginTop: 20,
  color: '#000',
  textAlign: 'center',
};
