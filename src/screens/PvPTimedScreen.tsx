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
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const iconSources = {
  Rock: require("../../assets/pixelRockGame.png"),
  Paper: require("../../assets/pixelPaperGame.png"),
  Scissors: require("../../assets/pixelScissorsGame.png"),
};

const choices = ["Rock", "Paper", "Scissors"] as const;

export default function PvPTimedScreen(): JSX.Element {
  const navigation = useNavigation();
  const [gameTimer, setGameTimer] = useState(60);
  const [round, setRound] = useState(1);
  const [player1Choice, setPlayer1Choice] = useState<string | null>(null);
  const [player2Choice, setPlayer2Choice] = useState<string | null>(null);
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
  const [turnTimer, setTurnTimer] = useState(10);
  const [result, setResult] = useState("");
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [finalResult, setFinalResult] = useState("");
  const [revealChoices, setRevealChoices] = useState(false);
  const [roundResults, setRoundResults] = useState<string[]>([]);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const turnTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (player1Choice && player2Choice) {
      setRevealChoices(true);
    }
  }, [player1Choice, player2Choice]);

  useEffect(() => {
    if (revealChoices && player1Choice && player2Choice) {
      setTimeout(() => {
        handleRoundEnd();
      }, 2000);
    }
  }, [revealChoices]);

  useEffect(() => {
    if (!gameOver && !revealChoices) {
      turnTimerRef.current = setInterval(() => {
        setTurnTimer((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (turnTimerRef.current) clearInterval(turnTimerRef.current);
      };
    }
  }, [gameOver, revealChoices, isPlayer1Turn]);

  useEffect(() => {
    if (!gameOver && !revealChoices) {
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

  const getWinner = (p1: string, p2: string) => {
    if (p1 === p2) return "Draw";
    if (
      (p1 === "Rock" && p2 === "Scissors") ||
      (p1 === "Paper" && p2 === "Rock") ||
      (p1 === "Scissors" && p2 === "Paper")
    ) {
      return "Player 1";
    }
    return "Player 2";
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

  const handleRoundEnd = () => {
    if (!player1Choice || !player2Choice) return;

    const winner = getWinner(player1Choice, player2Choice);
    let resultText = "Draw!";
    const newScore = { ...score };
    let roundResult = "";

    if (winner === "Player 1") {
      resultText = "Player 1 Wins!";
      roundResult = `Round ${round}: Player 1 won with ${player1Choice} vs ${player2Choice}`;
      newScore.p1 += 1;
    } else if (winner === "Player 2") {
      resultText = "Player 2 Wins!";
      roundResult = `Round ${round}: Player 2 won with ${player2Choice} vs ${player1Choice}`;
      newScore.p2 += 1;
    } else {
      roundResult = `Round ${round}: Draw (${player1Choice} vs ${player2Choice})`;
    }

    setScore(newScore);
    setResult(resultText);
    setRoundResults((prev) => [...prev, roundResult]);

    setTimeout(() => {
      if (gameTimer <= 0) {
        setGameOver(true);
        evaluateFinalResult(newScore);
        return;
      }

      setRound((r) => r + 1);
      setResult("");
      setPlayer1Choice(null);
      setPlayer2Choice(null);
      setRevealChoices(false);
      setIsPlayer1Turn(true);
      setTurnTimer(10);
    }, 2000);
  };

  const evaluateFinalResult = (scores = score) => {
    const final =
      scores.p1 > scores.p2
        ? "🏆 Player 1 is the Winner!"
        : scores.p2 > scores.p1
        ? "🏆 Player 2 is the Winner!"
        : "🤝 It's a Tie!";
    setFinalResult(final);
  };

  const handleChoice = (choice: string) => {
    if (gameOver || revealChoices) return;
    if (isPlayer1Turn) {
      setPlayer1Choice(choice);
      setIsPlayer1Turn(false);
    } else {
      setPlayer2Choice(choice);
    }
  };

  const giveUp = () => {
    setGameOver(true);
    setFinalResult(
      isPlayer1Turn ? "🚩 Player 1 surrendered!" : "🚩 Player 2 surrendered!"
    );
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

      {/* Player 2 View (Top - Upside Down) */}
      <View style={[styles.playerContainer, styles.player2Container]}>
        <View style={styles.scoreContainer}>
          <Text style={styles.playerLabel}>Player 2</Text>
          <Text style={styles.scoreText}>Score: {score.p2}</Text>
          {!isPlayer1Turn && !revealChoices && (
            <Text style={styles.timerText}>⏱️ {turnTimer}s</Text>
          )}
          <Text style={styles.roundText}>Round {round}</Text>
          <Text style={styles.gameTimerText}>Game Time: {gameTimer}s</Text>
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
        ) : !isPlayer1Turn ? (
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
          <Text style={styles.waitingText}>Waiting for Player 1...</Text>
        )}
      </View>

      {/* Player 1 View (Bottom - Right Side Up) */}
      <View style={styles.playerContainer}>
        <View style={styles.scoreContainer}>
          <Text style={styles.playerLabel}>Player 1</Text>
          <Text style={styles.scoreText}>Score: {score.p1}</Text>
          {isPlayer1Turn && !revealChoices && (
            <Text style={styles.timerText}>⏱️ {turnTimer}s</Text>
          )}
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
        ) : isPlayer1Turn ? (
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
          <Text style={styles.waitingText}>Waiting for Player 2...</Text>
        )}

        {!gameOver && !revealChoices && isPlayer1Turn && (
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
                <Text
                  key={index}
                  style={[
                    styles.roundResultText,
                    {
                      backgroundColor: result.includes("Player 1")
                        ? "#dbeafe"
                        : result.includes("Player 2")
                        ? "#fee2e2"
                        : "#e2e8f0",
                      color: result.includes("Player 1")
                        ? "#1e40af"
                        : result.includes("Player 2")
                        ? "#b91c1c"
                        : "#334155",
                    },
                  ]}
                >
                  {result}
                </Text>
              ))}
            </View>

            <View style={styles.finalScoreContainer}>
              <Text style={styles.finalScoreText}>
                Final Score: {score.p1} - {score.p2}
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  player2Container: {
    transform: [{ rotate: "180deg" }],
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff5e6",
    padding: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#f4d5a6",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playerLabel: {
    fontFamily: "ByteBounce",
    fontSize: 30,
    color: "#333",
  },
  scoreText: {
    fontFamily: "ByteBounce",
    fontSize: 35,
    color: "#2a9d8f",
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  timerText: {
    fontFamily: "ByteBounce",
    fontSize: 35,
    color: "#e63946",
    textShadowColor: "#fff",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    marginVertical: 5,
  },
  gameTimerText: {
    fontFamily: "ByteBounce",
    fontSize: 20,
    color: "#000",
  },
  roundText: {
    fontFamily: "ByteBounce",
    fontSize: 20,
    color: "#000",
  },
  choiceDisplay: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  choiceImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  choiceText: {
    fontFamily: "ByteBounce",
    fontSize: 30,
    color: "#000",
  },
  choicesContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  instructionText: {
    fontFamily: "ByteBounce",
    fontSize: 30,
    marginBottom: 30,
    color: "#000",
    textAlign: "center",
  },
  waitingText: {
    fontFamily: "ByteBounce",
    fontSize: 25,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  choiceButtons: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%",
  },
  choiceButton: {
    alignItems: "center",
    margin: 10,
  },
  choiceButtonImage: {
    width: 100,
    height: 100,
  },
  choiceLabel: {
    fontFamily: "ByteBounce",
    fontSize: 20,
    color: "#000",
    marginTop: 5,
  },
  giveUpButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ff3e3e",
    marginTop: 20,
  },
  gameOverContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  gameOverBox: {
    backgroundColor: "#fdf5e6",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#f4d5a6",
    width: "90%",
    maxWidth: 400,
  },
  gameOverTitle: {
    fontFamily: "ByteBounce",
    fontSize: 40,
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#ffd700",
    borderWidth: 4,
    borderColor: "#ffb703",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  roundResultsContainer: {
    width: "100%",
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    maxHeight: 200,
  },
  resultsHeader: {
    fontFamily: "ByteBounce",
    fontSize: 22,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  roundResultText: {
    fontFamily: "ByteBounce",
    fontSize: 18,
    color: "#000",
    marginVertical: 4,
  },
  finalScoreContainer: {
    marginVertical: 15,
  },
  finalScoreText: {
    fontFamily: "ByteBounce",
    fontSize: 28,
    color: "#000",
    textAlign: "center",
  },
  playAgainButton: {
    backgroundColor: "#51cf66",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2b8a3e",
    marginTop: 10,
  },
  buttonText: {
    fontFamily: "ByteBounce",
    fontSize: 25,
    color: "#000",
  },
});
