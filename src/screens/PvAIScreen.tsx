import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../types";

const { width } = Dimensions.get("window");

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
  const [sequenceRunning, setSequenceRunning] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationScale] = useState(new Animated.Value(1));
  const [label, setLabel] = useState<Choice>("Rock");
  const [result, setResult] = useState("");
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [finalResult, setFinalResult] = useState("");
  const [turnTimer, setTurnTimer] = useState(10);
  const choices: Choice[] = ["Rock", "Paper", "Scissors"];
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (playerChoice && !aiChoice && !sequenceRunning) {
      const aiDecision = makeAiChoice();
      setAiChoice(aiDecision);
      startSequence();
    }
  }, [playerChoice]);

  useEffect(() => {
    if (!sequenceRunning && !gameOver && !playerChoice && turnTimer > 0) {
      const timer = setInterval(() => {
        setTurnTimer((prev) => {
          if (prev <= 1) {
            handleChoice(choices[Math.floor(Math.random() * 3)]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [sequenceRunning, gameOver, playerChoice, turnTimer]);

  useEffect(() => {
    if (mode === "Timed" && !sequenceRunning && !gameOver) {
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
  }, [sequenceRunning, gameOver]);

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

  const startSequence = () => {
    setSequenceRunning(true);
    setTimeout(() => {
      handleRoundEnd();
      setSequenceRunning(false);
    }, 2000);
  };

  const handleRoundEnd = () => {
    if (!playerChoice || !aiChoice) return;

    const winner = getWinner(playerChoice, aiChoice);
    let resultText = "Draw!";
    const newScore = { ...score };

    if (winner === "Player") {
      resultText = "You Win!";
      newScore.player += 1;
    } else if (winner === "AI") {
      resultText = "AI Wins!";
      newScore.ai += 1;
    }

    setScore(newScore);
    setResult(resultText);

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
    if (sequenceRunning || gameOver) return;
    setPlayerChoice(choice);
  };

  const giveUp = () => {
    setGameOver(true);
    setFinalResult("🚩 You surrendered!");
  };

  const playAgain = () => {
    navigation.goBack();
  };

  const currentChoice = choices[currentFrame];
  const icon = iconSources[currentChoice];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ff7173", "#cdecfb", "#63c4f1"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>CLASH</Text>
        <Text style={styles.subtitle}>OF</Text>
        <Text style={styles.footerTitle}>HANDS</Text>

        {/* Scoreboard */}
        <View style={styles.scoreboard}>
          <View style={styles.scoreColumn}>
            <Text style={styles.playerLabel}>👤 You</Text>
            <Text style={styles.scoreText}>Score: {score.player}</Text>
          </View>
          <View style={styles.scoreColumn}>
            <Text style={styles.roundLabel}>🕹️ Round {round}</Text>
            {mode === "Timed" && (
              <Text style={styles.timerText}>⏱️ {gameTimer}s</Text>
            )}
          </View>
          <View style={styles.scoreColumn}>
            <Text style={styles.playerLabel}>AI 🤖</Text>
            <Text style={styles.scoreText}>Score: {score.ai}</Text>
          </View>
        </View>

        {/* Game Info */}
        {!sequenceRunning && !gameOver && !!result && (
          <Text style={[styles.infoText, {
            color: result.includes('You') ? '#2563eb' : 
                  result.includes('AI') ? '#ef4444' : '#000'
          }]}>
            {result}
          </Text>
        )}
        {!sequenceRunning && !gameOver && !result && (
          <Text style={styles.infoText}>
            {!playerChoice ? `Your Turn (${turnTimer}s)` : `AI is choosing...`}
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
              {playerChoice ? (
                <>
                  <Image
                    source={iconSources[playerChoice]}
                    style={styles.choiceImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.labelText}>{playerChoice}</Text>
                </>
              ) : (
                <Text style={styles.waitingText}>Your Choice</Text>
              )}
            </View>

            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            <View style={styles.playerContainer}>
              {aiChoice ? (
                <>
                  <Image
                    source={iconSources[aiChoice]}
                    style={styles.choiceImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.labelText}>{aiChoice}</Text>
                </>
              ) : (
                <Text style={styles.waitingText}>AI Choice</Text>
              )}
            </View>
          </View>
        )}

        {/* Choice Buttons */}
        {!playerChoice && !sequenceRunning && !gameOver && (
          <View style={styles.choiceButtonsContainer}>
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
                <Text style={styles.labelText}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Buttons */}
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