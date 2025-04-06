import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

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
  const roundTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (player1Choice && player2Choice) {
      startSequence();
    }
  }, [player1Choice, player2Choice]);

  useEffect(() => {
    if (sequenceRunning || gameOver) return;

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
  }, [sequenceRunning, isPlayer1Turn, gameOver]);

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
    if (isPlayer1Turn) {
      setPlayer1Choice(randomChoice);
      setIsPlayer1Turn(false);
    } else {
      setPlayer2Choice(randomChoice);
    }
  };

  const startSequence = () => {
    setSequenceRunning(true);
    setTimeout(() => {
      handleRoundEnd();
      setSequenceRunning(false);
    }, 2000);
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
      setIsPlayer1Turn(true);
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#ff7173', '#cdecfb', '#63c4f1']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>CLASH</Text>
        <Text style={styles.subtitle}>OF</Text>
        <Text style={styles.footerTitle}>HANDS</Text>

        {/* Scoreboard */}
        <View style={styles.scoreboard}>
          <View style={styles.scoreColumn}>
            <Text style={styles.playerLabel}>
              {isPlayer1Turn ? '▶️ Player 1' : 'Player 1'}
            </Text>
            <Text style={styles.scoreText}>Score: {score.p1}</Text>
          </View>
          <View style={styles.scoreColumn}>
            <Text style={styles.roundLabel}>🕹️ Round {round}</Text>
            <Text style={styles.timerText}>⏱️ {turnTimer}s</Text>
          </View>
          <View style={styles.scoreColumn}>
            <Text style={styles.playerLabel}>
              {!isPlayer1Turn ? '▶️ Player 2' : 'Player 2'}
            </Text>
            <Text style={styles.scoreText}>Score: {score.p2}</Text>
          </View>
        </View>

        {/* Game Info */}
        {!sequenceRunning && !gameOver && !!result && (
          <Text style={[styles.infoText, {
            color: result.includes('Player 1') ? '#2563eb' : 
                  result.includes('Player 2') ? '#ef4444' : '#000'
          }]}>
            {result}
          </Text>
        )}
        {!sequenceRunning && !gameOver && !result && (
          <Text style={styles.infoText}>
            {isPlayer1Turn
              ? `Player 1's Turn (${turnTimer}s)`
              : `Player 2's Turn (${turnTimer}s)`}
          </Text>
        )}
        {!!gameOver && (
          <Text style={[styles.infoText, { marginTop: 10 }]}>
            {finalResult}
          </Text>
        )}

        {/* Game UI */}
        {sequenceRunning ? (
          <View style={styles.sequenceContainer}>
            <Animated.Image
              source={icon}
              style={[
                styles.sequenceImage,
                { transform: [{ scale: animationScale }] },
              ]}
              resizeMode="contain"
            />
            <Text style={styles.labelText}>{label}</Text>
          </View>
        ) : (
          <View style={styles.choicesContainer}>
            <View style={styles.playerContainer}>
              {player1Choice ? (
                <>
                  <Image
                    source={iconSources[player1Choice]}
                    style={styles.choiceImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.labelText}>{player1Choice}</Text>
                </>
              ) : (
                <Text style={styles.waitingText}>Waiting...</Text>
              )}
            </View>

            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            <View style={styles.playerContainer}>
              {player2Choice ? (
                <>
                  <Image
                    source={iconSources[player2Choice]}
                    style={styles.choiceImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.labelText}>{player2Choice}</Text>
                </>
              ) : (
                <Text style={styles.waitingText}>Waiting...</Text>
              )}
            </View>
          </View>
        )}

        {/* Choice Buttons */}
        {!player1Choice && !player2Choice && !sequenceRunning && !gameOver && (
          <View style={styles.choiceButtonsContainer}>
            {choices.map((choice) => (
              <TouchableOpacity
                key={choice}
                onPress={() => handleChoice(choice)}
                style={styles.choiceButton}
              >
                <Image
                  source={iconSources[choice]}
                  style={[
                    styles.choiceButtonImage,
                    { opacity: isPlayer1Turn ? 1 : 0.6 }
                  ]}
                  resizeMode="contain"
                />
                <Text style={styles.labelText}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        {!gameOver && !sequenceRunning && (
          <TouchableOpacity onPress={giveUp} style={styles.giveUpButton}>
            <Text style={styles.buttonText}>Give Up</Text>
          </TouchableOpacity>
        )}

        {gameOver && (
          <TouchableOpacity onPress={playAgain} style={styles.playAgainButton}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "ByteBounce",
    fontSize: 100,
    color: "#ff7072",
    textAlign: "center",
    textShadowColor: "#000000aa",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontFamily: "ByteBounce",
    fontSize: 50,
    color: "#000",
    textAlign: "center",
    textShadowColor: "#000000aa",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  footerTitle: {
    fontFamily: "ByteBounce",
    fontSize: 100,
    color: "#e5aa7a",
    textAlign: "center",
    textShadowColor: "#000000aa",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  scoreboard: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fdf5e6",
    borderColor: "#f4d5a6",
    borderWidth: 4,
    borderRadius: 16,
    maxWidth: 380,
  },
  scoreColumn: {
    alignItems: "center",
  },
  playerLabel: {
    fontFamily: "ByteBounce",
    fontSize: 25,
    color: "#333",
  },
  scoreText: {
    fontFamily: "ByteBounce",
    fontSize: 22,
    color: "#000",
  },
  roundLabel: {
    fontFamily: "ByteBounce",
    fontSize: 23,
    color: "#000",
  },
  timerText: {
    fontFamily: "ByteBounce",
    fontSize: 31,
    color: "#111",
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  infoText: {
    fontFamily: "ByteBounce",
    fontSize: 38,
    marginTop: 8,
    textAlign: "center",
  },
  sequenceContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  sequenceImage: {
    width: 180,
    height: 180,
  },
  choicesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 40,
  },
  playerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
  },
  vsContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
  },
  vsText: {
    fontFamily: "ByteBounce",
    fontSize: 40,
    color: "#000",
  },
  waitingText: {
    fontFamily: "ByteBounce",
    fontSize: 24,
    color: "#666",
  },
  choiceImage: {
    width: 120,
    height: 120,
  },
  choiceButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 30,
    gap: 20,
  },
  choiceButton: {
    alignItems: "center",
  },
  choiceButtonImage: {
    width: 100,
    height: 100,
  },
  labelText: {
    fontFamily: "ByteBounce",
    fontSize: 25,
    marginTop: 10,
    color: "#000",
    textAlign: "center",
  },
  giveUpButton: {
    backgroundColor: "#ff6b6b",
    marginTop: 40,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ff3e3e",
  },
  playAgainButton: {
    backgroundColor: "#51cf66",
    marginTop: 40,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2b8a3e",
  },
  buttonText: {
    fontFamily: "ByteBounce",
    fontSize: 25,
    color: "#000",
  },
});