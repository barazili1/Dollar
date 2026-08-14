export type AppState = 'splash' | 'login' | 'conditions';

export type GameType = 'apple' | 'mines';

export interface WinnerNotification {
  id: string;
  maskedUser: string;
  amount: string;
  currency: string;
  game: string;
  timestamp: string;
}

export interface VerificationData {
  userId: string;
  telegramUsername: string;
  selectedGame: GameType;
  depositImage: string | null;
  idImage: string | null;
}
