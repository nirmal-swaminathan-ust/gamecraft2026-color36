import type { Digit, TileColor } from './types'

export const TILE_COLORS = {
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#22C55E',
  yellow: '#FACC15',
} as const satisfies Record<TileColor, string>

export const COLORS: TileColor[] = ['red', 'blue', 'green', 'yellow']

export const DIGIT_TO_WORD = {
  0: 'ZERO',
  1: 'ONE',
  2: 'TWO',
  3: 'THREE',
  4: 'FOUR',
  5: 'FIVE',
  6: 'SIX',
  7: 'SEVEN',
  8: 'EIGHT',
  9: 'NINE',
} as const satisfies Record<Digit, string>

export const WORD_TO_DIGIT = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
} as const satisfies Record<string, Digit>

export const NUMBER_WORDS = Object.values(DIGIT_TO_WORD)
export const COLOR_WORDS = ['RED', 'BLUE', 'GREEN', 'YELLOW'] as const
export const STORAGE_KEY = 'color36_leaderboard'
