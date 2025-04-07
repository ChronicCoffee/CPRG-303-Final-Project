import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const iconSources = {
  Rock: require('../../assets/pixelRockGame.png'),
  Paper: require('../../assets/pixelPaperGame.png'),
  Scissors: require('../../assets/pixelScissorsGame.png'),
};

const choices = ['Rock', 'Paper', 'Scissors'] as const;

export default function PvPBestOf3Screen(): JSX.Element {
  const navigation = useNavigation();
  const [round, setRound] = useState(1);
  const [player1Choice, setPlayer1Choice] = useState<string | null>(null);
  const [player2Choice, setPlayer2Choice] = useState<string | null>(null);
  const [turnTimer, setTurnTimer] = useState(10);
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [finalResult, setFinalResult] = useState('');
  const [revealChoices, setRevealChoices] = useState(false);
  const roundTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (player1Choice && player2Choice) {
      setRevealChoices(true);
      setTimeout(() => {
        handleRoundEnd();
      }, 2000);
    }
  }, [player1Choice, player2Choice]);

  useEffect(() => {
    if (gameOver) return;

    roundTimerRef.current = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    };
  }, [gameOver]);

  const getWinner = (p1: string, p2: string) => {
    if (p1 === p2) return 'Draw';
    if ((p1 === 'Rock' && p2 === 'Scissors') || 
        (p1 === 'Paper' && p2 === 'Rock') || 
        (p1 === 'Scissors' && p2 === 'Paper')) {
      return 'Player 1';
    }
    return 'Player 2';
  };

  const handleTimeout = () => {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    if (!player1Choice) {
      setPlayer1Choice(randomChoice);
    } else if (!player2Choice) {
      setPlayer2Choice(randomChoice);
    }
  };

  const handleRoundEnd = () => {
    if (!player1Choice || !player2Choice) return;

    const winner = getWinner(player1Choice, player2Choice);
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

    setTimeout(() => {
      if (newScore.p1 >= 2 || newScore.p2 >= 2) {
        setGameOver(true);
        evaluateFinalResult(newScore);
        return;
      }

      setRound((r) => r + 1);
      setResult('');
      setPlayer1Choice(null);
      setPlayer2Choice(null);
      setRevealChoices(false);
      setTurnTimer(10);
    }, 2000);
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

  const handleChoice = (choice: string, player: number) => {
    if (gameOver || revealChoices) return;
    if (player === 1) {
      setPlayer1Choice(choice);
    } else {
      setPlayer2Choice(choice);
    }
  };

  const giveUp = () => {
    setGameOver(true);
    setFinalResult('🚩 Game surrendered!');
  };

  const playAgain = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ff7173', '#cdecfb', '#63c4f1']}
        style={StyleSheet.absoluteFill}
      />

      {/* Player 1 View (Right Side Up) */}
      <View style={styles.playerContainer}>
        <View style={styles.scoreContainer}>
          <Text style={styles.playerLabel}>Player 1</Text>
          <Text style={styles.scoreText}>Score: {score.p1}</Text>
          <Text style={styles.timerText}>⏱️ {turnTimer}s</Text>
          <Text style={styles.roundText}>Round {round}</Text>
        </View>

        {revealChoices ? (
          <View style={styles.choiceDisplay}>
            <Image
              source={iconSources[player1Choice as keyof typeof iconSources]}
              style={styles.choiceImage}
              resizeMode="contain"
            />
            <Text style={styles.choiceText}>{player1Choice}</Text>
          </View>
        ) : (
          <View style={styles.choicesContainer}>
            <Text style={styles.instructionText}>Make your choice!</Text>
            <View style={styles.choiceButtons}>
              {choices.map((choice) => (
                <TouchableOpacity
                  key={choice}
                  onPress={() => handleChoice(choice, 1)}
                  disabled={!!player1Choice}
                  style={[styles.choiceButton, player1Choice && styles.disabledButton]}
                >
                  <Image
                    source={iconSources[choice]}
                    style={styles.choiceButtonImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.choiceLabel}>{choice}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {!gameOver && !revealChoices && (
          <TouchableOpacity onPress={giveUp} style={styles.giveUpButton}>
            <Text style={styles.buttonText}>Give Up</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Player 2 View (Upside Down) */}
      <View style={[styles.playerContainer, styles.upsideDown]}>
        <View style={styles.scoreContainer}>
          <Text style={styles.playerLabel}>Player 2</Text>
          <Text style={styles.scoreText}>Score: {score.p2}</Text>
          <Text style={styles.timerText}>⏱️ {turnTimer}s</Text>
          <Text style={styles.roundText}>Round {round}</Text>
        </View>

        {revealChoices ? (
          <View style={styles.choiceDisplay}>
            <Image
              source={iconSources[player2Choice as keyof typeof iconSources]}
              style={styles.choiceImage}
              resizeMode="contain"
            />
            <Text style={styles.choiceText}>{player2Choice}</Text>
          </View>
        ) : (
          <View style={styles.choicesContainer}>
            <Text style={styles.instructionText}>Make your choice!</Text>
            <View style={styles.choiceButtons}>
              {choices.map((choice) => (
                <TouchableOpacity
                  key={choice}
                  onPress={() => handleChoice(choice, 2)}
                  disabled={!!player2Choice}
                  style={[styles.choiceButton, player2Choice && styles.disabledButton]}
                >
                  <Image
                    source={iconSources[choice]}
                    style={styles.choiceButtonImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.choiceLabel}>{choice}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {!gameOver && !revealChoices && (
          <TouchableOpacity onPress={giveUp} style={styles.giveUpButton}>
            <Text style={styles.buttonText}>Give Up</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Game Over Modal */}
      {gameOver && (
        <View style={styles.gameOverContainer}>
          <View style={styles.gameOverBox}>
            <Text style={styles.gameOverText}>{finalResult}</Text>
            <TouchableOpacity onPress={playAgain} style={styles.playAgainButton}>
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  upsideDown: {
    transform: [{ rotate: '180deg' }],
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playerLabel: {
    fontFamily: 'ByteBounce',
    fontSize: 30,
    color: '#333',
  },
  scoreText: {
    fontFamily: 'ByteBounce',
    fontSize: 25,
    color: '#000',
  },
  timerText: {
    fontFamily: 'ByteBounce',
    fontSize: 25,
    color: '#111',
  },
  roundText: {
    fontFamily: 'ByteBounce',
    fontSize: 20,
    color: '#000',
  },
  choiceDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  choiceImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  choiceText: {
    fontFamily: 'ByteBounce',
    fontSize: 30,
    color: '#000',
  },
  choicesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  instructionText: {
    fontFamily: 'ByteBounce',
    fontSize: 30,
    marginBottom: 30,
    color: '#000',
    textAlign: 'center',
  },
  choiceButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  choiceButton: {
    alignItems: 'center',
    margin: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  choiceButtonImage: {
    width: 100,
    height: 100,
  },
  choiceLabel: {
    fontFamily: 'ByteBounce',
    fontSize: 20,
    color: '#000',
    marginTop: 5,
  },
  giveUpButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff3e3e',
    marginTop: 20,
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  gameOverBox: {
    backgroundColor: '#fdf5e6',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#f4d5a6',
  },
  gameOverText: {
    fontFamily: 'ByteBounce',
    fontSize: 30,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  playAgainButton: {
    backgroundColor: '#51cf66',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2b8a3e',
  },
  buttonText: {
    fontFamily: 'ByteBounce',
    fontSize: 25,
    color: '#000',
  },
});