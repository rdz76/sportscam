export type SportType = 'calcio' | 'basket' | 'pallavolo';

export interface SportPreset {
  name: string;
  defaultDuration: number; // in seconds
  pointsPerScore: number;
  maxScore?: number;
  timerDirection: 'countdown' | 'countup';
  periods: number;
  periodDuration: number;
}

export interface TeamConfig {
  id: string;
  name: string;
  homeTeam: string;
  awayTeam: string;
  sport: SportType;
  createdAt: number;
}

export const SPORT_PRESETS: Record<SportType, SportPreset> = {
  calcio: {
    name: 'Calcio',
    defaultDuration: 5400, // 90 minuti (2 tempi da 45)
    pointsPerScore: 1,
    timerDirection: 'countup',
    periods: 2,
    periodDuration: 2700, // 45 minuti
  },
  basket: {
    name: 'Basket',
    defaultDuration: 2400, // 40 minuti (4 quarti da 10)
    pointsPerScore: 2,
    timerDirection: 'countdown',
    periods: 4,
    periodDuration: 600, // 10 minuti
  },
  pallavolo: {
    name: 'Pallavolo',
    defaultDuration: 0, // Senza timer fisso
    pointsPerScore: 1,
    maxScore: 25,
    timerDirection: 'countup',
    periods: 5,
    periodDuration: 0,
  },
};
