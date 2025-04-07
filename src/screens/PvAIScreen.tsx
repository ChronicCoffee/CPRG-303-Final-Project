import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../types";

const { width, height } = Dimensions.get("window");

const iconSources = {
  Rock: require("../../assets/pixelRockGame.png"),
  Paper: require("../../assets/pixelPaperGame.png"),
  Scissors: require("../../assets/pixelScissorsGame.png"),
};

type Choice = "Rock" | "Paper" | "Scissors";

export default function PvAIScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "PvAIScreen">>();
  const { difficulty, mode } = route.params;
  const navigation = useNavigation();
  const [gameTimer, setGameTimer] = useState(mode === "Timed" ? 60 : 0);
  const [round, setRound] = useState(1);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [turnTimer, setTurnTimer] = useState(10);
  const [result, setResult] = useState("");
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [finalResult, setFinalResult] = useState("");
  const [revealChoices, setRevealChoices] = useState(false);
  const [roundResults, setRoundResults] = useState<string[]>([]);
  const choices: Choice[] = ["Rock", "Paper", "Scissors"];
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const turnTimerRef = useRef<NodeJS.Timeout | null>(null);

  const makeAiChoice = (): Choice => {
    if (difficulty === "Easy") {
      return choices[Math.floor(Math.random() * 3)];
    } else if (difficulty === "Medium") {
      if (aiChoice && Math.random() > 0.3) {
        const otherChoices = choices.filter((c) => c !== aiChoice);
        return otherChoices[Math.floor(Math.random() * 2)];
      }
      return choices[Math.floor(Math.random() * 3)];
    } else {
      if (playerChoice && Math.random() > 0.6) {
        if (playerChoice === "Rock") return "Paper";
        if (playerChoice === "Paper") return "Scissors";
        return "Rock";
      }
      return choices[Math.floor(Math.random() * 3)];
    }
  };

  useEffect(() => {
    if (playerChoice && !aiChoice) {
      const aiDecision = makeAiChoice();
      setAiChoice(aiDecision);
      setRevealChoices(true);
    }
  }, [playerChoice]);

  useEffect(() => {
    if (revealChoices && playerChoice && aiChoice) {
      setTimeout(() => {
        handleRoundEnd();
      }, 2000);
    }
  }, [revealChoices]);

  useEffect(() => {
    if (!gameOver && !revealChoices && !playerChoice) {
      turnTimerRef.current = setInterval(() => {
        setTurnTimer((prev) => {
          if (prev <= 1) {
            handleChoice(choices[Math.floor(Math.random() * 3)]);
            return 10;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (turnTimerRef.current) clearInterval(turnTimerRef.current);
      };
    }
  }, [gameOver, revealChoices, playerChoice]);

  useEffect(() => {
    if (mode === "Timed" && !gameOver && !revealChoices) {
      gameTimerRef.current = setInterval(() => {
        setGameTimer((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            evaluateFinalResult();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      };
    }
  }, [gameOver, revealChoices]);

  const getWinner = (p1: Choice, p2: Choice) => {
    if (p1 === p2) return "Draw";
    if (
      (p1 === "Rock" && p2 === "Scissors") ||
      (p1 === "Paper" && p2 === "Rock") ||
      (p1 === "Scissors" && p2 === "Paper")
    ) {
      return "Player";
    }
    return "AI";
  };

  const handleRoundEnd = () => {
    if (!playerChoice || !aiChoice) return;

    const winner = getWinner(playerChoice, aiChoice);
    let resultText = "Draw!";
    const newScore = { ...score };
    let roundResult = "";

    if (winner === "Player") {
      resultText = "You Win!";
      roundResult = `Round ${round}: You won with ${playerChoice} vs ${aiChoice}`;
      newScore.player += 1;
    } else if (winner === "AI") {
      resultText = "AI Wins!";
      roundResult = `Round ${round}: AI won with ${aiChoice} vs ${playerChoice}`;
      newScore.ai += 1;
    } else {
      roundResult = `Round ${round}: Draw (${playerChoice} vs ${aiChoice})`;
    }

    setScore(newScore);
    setResult(resultText);
    setRoundResults(prev => [...prev, roundResult]);

    setTimeout(() => {
      if (mode === "BestOf3" && (newScore.player >= 2 || newScore.ai >= 2)) {
        setGameOver(true);
        evaluateFinalResult(newScore);
        return;
      }

      setRound((r) => r + 1);
      setResult("");
      setPlayerChoice(null);
      setAiChoice(null);
      setRevealChoices(false);
      setTurnTimer(10);
    }, 2000);
  };

  const evaluateFinalResult = (scores = score) => {
    const final =
      scores.player > scores.ai
        ? "🏆 You are the Winner!"
        : scores.ai > scores.player
        ? "🤖 AI is the Winner!"
        : "🤝 It's a Tie!";
    setFinalResult(final);
  };

  const handleChoice = (choice: Choice) => {
    if (gameOver || revealChoices) return;
    setPlayerChoice(choice);
  };

  const giveUp = () => {
    setGameOver(true);
    setFinalResult("🚩 You surrendered!");
  };

  const playAgain = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ff7173", "#cdecfb", "#63c4f1"]}
        style={StyleSheet.absoluteFill}
      />

      {/* AI View (Top - Upside Down) */}
      <View style={[styles.playerContainer, styles.player2Container]}>
        <View style={styles.scoreContainer}>
          <Text style={styles.playerLabel}>AI 🤖</Text>
          <Text style={styles.scoreText}>Score: {score.ai}</Text>
          {!playerChoice && !revealChoices && (
            <Text style={styles.timerText}>⏱️ {turnTimer}s</Text>
          )}
          <Text style={styles.roundText}>Round {round}</Text>
          {mode === "Timed" && (
            <Text style={styles.gameTimerText}>Game Time: {gameTimer}s</Text>
          )}
        </View>

        {revealChoices ? (
          <View style={styles.choiceDisplay}>
            <Image
              source={iconSources[aiChoice as keyof typeof iconSources]}
              style={styles.choiceImage}
              resizeMode="contain"
            />
            <Text style={styles.choiceText}>{aiChoice}</Text>
          </View>
        ) : (
          <Text style={styles.waitingText}>
            {playerChoice ? "AI is choosing..." : "Waiting for your choice..."}
          </Text>
        )}
      </View>

      {/* Player View (Bottom - Right Side Up) */}
      <View style={styles.playerContainer}>
        <View style={styles.scoreContainer}>
          <Text style={styles.playerLabel}>👤 You</Text>
          <Text style={styles.scoreText}>Score: {score.player}</Text>
          {!playerChoice && !revealChoices && (
            <Text style={styles.timerText}>⏱️ {turnTimer}s</Text>
          )}
          <Text style={styles.roundText}>Round {round}</Text>
        </View>

        {revealChoices ? (
          <View style={styles.choiceDisplay}>
            <Image
              source={iconSources[playerChoice as keyof typeof iconSources]}
              style={styles.choiceImage}
              resizeMode="contain"
            />
            <Text style={styles.choiceText}>{playerChoice}</Text>
          </View>
        ) : !playerChoice ? (
          <View style={styles.choicesContainer}>
            <Text style={styles.instructionText}>Your turn! Choose!</Text>
            <View style={styles.choiceButtons}>
              {choices.map((choice) => (
                <TouchableOpacity
                  key={choice}
                  onPress={() => handleChoice(choice)}
                  style={styles.choiceButton}
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
        ) : (
          <Text style={styles.waitingText}>Waiting for AI...</Text>
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
            <Text style={styles.gameOverTitle}>{finalResult}</Text>
            
            <View style={styles.roundResultsContainer}>
              <Text style={styles.resultsHeader}>Round Results:</Text>
              {roundResults.map((result, index) => (
                <Text key={index} style={styles.roundResultText}>
                  {result}
                </Text>
              ))}
            </View>
            
            <View style={styles.finalScoreContainer}>
              <Text style={styles.finalScoreText}>
                Final Score: {score.player} - {score.ai}
              </Text>
            </View>
            
            <TouchableOpacity 
              onPress={playAgain} 
              style={styles.playAgainButton}
            >
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
  player2Container: {
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
  gameTimerText: {
    fontFamily: 'ByteBounce',
    fontSize: 20,
    color: '#000',
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
  waitingText: {
    fontFamily: 'ByteBounce',
    fontSize: 25,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
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
    width: '90%',
    maxWidth: 400,
  },
  gameOverTitle: {
    fontFamily: 'ByteBounce',
    fontSize: 36,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  roundResultsContainer: {
    width: '100%',
    marginVertical: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    maxHeight: 200,
  },
  resultsHeader: {
    fontFamily: 'ByteBounce',
    fontSize: 22,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  roundResultText: {
    fontFamily: 'ByteBounce',
    fontSize: 18,
    color: '#000',
    marginVertical: 4,
  },
  finalScoreContainer: {
    marginVertical: 15,
  },
  finalScoreText: {
    fontFamily: 'ByteBounce',
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
  },
  playAgainButton: {
    backgroundColor: '#51cf66',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2b8a3e',
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'ByteBounce',
    fontSize: 25,
    color: '#000',
  },
});