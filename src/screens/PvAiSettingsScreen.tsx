import React, { useMemo, useState } from "react";
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
import { StackNavigationProp } from "@react-navigation/stack";
import { Clock } from "lucide-react-native";
import { RootStackParamList } from "../../types";

const { width, height } = Dimensions.get("window");

const iconSources = [
  require("../../assets/pixelRock.png"),
  require("../../assets/pixelPaper.png"),
  require("../../assets/pixelScissors.png"),
];

type PvAiSettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PvAiSettings"
>;

export default function PvAISettingsScreen(): JSX.Element {
  const navigation = useNavigation<PvAiSettingsScreenNavigationProp>();
  const [aiDifficulty, setAiDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Medium"
  );
  const [gameMode, setGameMode] = useState<"Timed" | "BestOf3">("Timed");

  const pixelArtImages = useMemo(() => {
    const items: {
      id: number;
      top: number;
      left: number;
      size: number;
      rotate: number;
      source: any;
    }[] = [];
    const maxIcons = 60;
    const maxTriesPerIcon = 100;

    const isOverlapping = (a: any, b: any) => {
      return !(
        a.left + a.size < b.left ||
        a.left > b.left + b.size ||
        a.top + a.size < b.top ||
        a.top > b.top + b.size
      );
    };

    for (let i = 0; i < maxIcons; i++) {
      let tries = 0;
      while (tries < maxTriesPerIcon) {
        const size = 40 + Math.random() * 60;
        const top = Math.random() * (height - size - 100);
        const left = Math.random() * (width - size);
        const rotate = Math.floor(Math.random() * 360);
        const source =
          iconSources[Math.floor(Math.random() * iconSources.length)];

        const newItem = { id: i, top, left, size, rotate, source };
        const hasCollision = items.some((existing) =>
          isOverlapping(existing, newItem)
        );

        if (!hasCollision) {
          items.push(newItem);
          break;
        }

        tries++;
      }
    }

    return items;
  }, []);

  const difficultyColorMap = {
    Easy: "#22c55e",
    Medium: "#facc15",
    Hard: "#ef4444",
  };

  const modeColorMap = {
    Timed: "#3b82f6",
    BestOf3: "#a855f7",
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ff7173", "#cdecfb", "#63c4f1"]}
        style={StyleSheet.absoluteFill}
      />

      {pixelArtImages.map(({ id, top, left, size, rotate, source }) => (
        <Image
          key={id}
          source={source}
          style={{
            position: "absolute",
            top,
            left,
            width: size,
            height: size,
            opacity: 0.6,
            transform: [{ rotate: `${rotate}deg` }],
            zIndex: 0,
          }}
          resizeMode="contain"
        />
      ))}

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>CLASH</Text>
          <Text style={styles.subtitle}>OF</Text>
          <Text style={styles.footerTitle}>HANDS</Text>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingsContent}>
            <Text style={styles.sectionTitle}>Mode Settings</Text>

            <Text style={styles.subsectionTitle}>AI Difficulty</Text>
            <View style={styles.optionsContainer}>
              {(["Easy", "Medium", "Hard"] as const).map((level) => {
                const isSelected = aiDifficulty === level;
                return (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setAiDifficulty(level)}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: isSelected
                          ? difficultyColorMap[level]
                          : "#ffffff",
                        borderColor: difficultyColorMap[level],
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isSelected
                            ? "#fff"
                            : difficultyColorMap[level],
                        },
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.subsectionTitle}>Game Mode</Text>
            <View style={styles.modeOptionsContainer}>
              <TouchableOpacity
                onPress={() => setGameMode("Timed")}
                style={[
                  styles.modeOption,
                  {
                    backgroundColor:
                      gameMode === "Timed" ? modeColorMap.Timed : "#ffffff",
                    borderColor: modeColorMap.Timed,
                  },
                ]}
              >
                <View style={styles.modeOptionContent}>
                  <Clock
                    size={24}
                    color={gameMode === "Timed" ? "#fff" : modeColorMap.Timed}
                    style={styles.clockIcon}
                  />
                  <Text
                    style={[
                      styles.modeOptionText,
                      {
                        color:
                          gameMode === "Timed" ? "#fff" : modeColorMap.Timed,
                      },
                    ]}
                  >
                    Timed Mode
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setGameMode("BestOf3")}
                style={[
                  styles.modeOption,
                  {
                    backgroundColor:
                      gameMode === "BestOf3" ? modeColorMap.BestOf3 : "#ffffff",
                    borderColor: modeColorMap.BestOf3,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modeOptionText,
                    {
                      color:
                        gameMode === "BestOf3" ? "#fff" : modeColorMap.BestOf3,
                    },
                  ]}
                >
                  📊 Best of 3
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  navigation.navigate("PvAIScreen", {
                    difficulty: aiDifficulty,
                    mode: gameMode,
                  });
                }}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    paddingTop: height * 0.1,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
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
    fontSize: 48,
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
  settingsCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#82cfff",
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#f4d5a6",
    padding: 24,
    height: height * 0.5,
    zIndex: 2,
  },
  settingsContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "ByteBounce",
    fontSize: 35,
    color: "#fff",
    textShadowColor: "#00000066",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    textAlign: "center",
  },
  subsectionTitle: {
    fontFamily: "ByteBounce",
    fontSize: 28,
    color: "#fff",
    textShadowColor: "#00000066",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 12,
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    marginHorizontal: 6,
  },
  optionText: {
    fontFamily: "ByteBounce",
    fontSize: 22,
  },
  modeOptionsContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 20,
  },
  modeOption: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
  },
  modeOptionContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  clockIcon: {
    marginRight: 8,
  },
  modeOptionText: {
    fontFamily: "ByteBounce",
    fontSize: 30,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 12,
  },
  backButton: {
    backgroundColor: "#c6e8ff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  continueButton: {
    backgroundColor: "#63c4f1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 4,
    borderColor: "#f4d5a6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontFamily: "ByteBounce",
    fontSize: 22,
    color: "#000",
  },
});