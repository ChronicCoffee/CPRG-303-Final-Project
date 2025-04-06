export type GameMode = 'Timed' | 'BestOf3';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Choice = 'Rock' | 'Paper' | 'Scissors' | null;

export type RootStackParamList = {
  Home: undefined;
  GameMode: undefined;
  Settings: undefined;
  PvPSettings: undefined;
  PvAiSettings: undefined;
  HowToPlay: undefined;
  PvPTimed: undefined;
  PvPBestOf3: undefined;
  PvAIScreen: {
    difficulty: Difficulty;
    mode: GameMode;
  };
};