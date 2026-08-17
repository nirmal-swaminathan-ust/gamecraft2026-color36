export type TileColor = 'red' | 'blue' | 'green' | 'yellow'
export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type NumberTargetWord =
  | 'ZERO'
  | 'ONE'
  | 'TWO'
  | 'THREE'
  | 'FOUR'
  | 'FIVE'
  | 'SIX'
  | 'SEVEN'
  | 'EIGHT'
  | 'NINE'

export type ColorTargetWord = 'RED' | 'BLUE' | 'GREEN' | 'YELLOW'

export interface Tile {
  id: string
  digit: Digit
  color: TileColor
  version: number
  isResolved: boolean
}

export interface NumberTarget {
  type: 'number'
  word: NumberTargetWord
  value: Digit
}

export interface ColorTarget {
  type: 'color'
  word: ColorTargetWord
  targetColor: TileColor
}

export type Target = NumberTarget | ColorTarget

export type GameStatus = 'welcome' | 'instructions' | 'playing' | 'finished'

export interface LeaderboardEntry {
  playerName: string
  score: number
  createdAt: string
  // Game metadata for validation
  correctClicks?: number
  incorrectClicks?: number
  completedTargets?: number
  gameChecksum?: string // Cryptographic verification
  version?: number // For future updates
}

export interface GameState {
  status: GameStatus
  playerName: string
  score: number
  timeRemaining: number
  tiles: Tile[]
  target: Target | null
  targetTileIds: Set<string>
  completedTargetTileIds: Set<string>
  correctClicks: number
  incorrectClicks: number
  completedTargets: number
  showInstructions: boolean
  finalResultRecorded: boolean
}

export type GameAction =
  | { type: 'SUBMIT_PLAYER_NAME'; playerName: string }
  | { type: 'SHOW_INSTRUCTIONS' }
  | { type: 'START_GAME' }
  | { type: 'TICK' }
  | { type: 'CLICK_TILE'; tileId: string }
  | { type: 'OPEN_INSTRUCTIONS' }
  | { type: 'CLOSE_INSTRUCTIONS' }
  | { type: 'REPLAY' }
  | { type: 'EXIT_TO_WELCOME' }
  | { type: 'RECORD_LEADERBOARD'; playerName: string; score: number }
