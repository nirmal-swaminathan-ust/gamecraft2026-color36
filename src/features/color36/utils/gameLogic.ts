import { COLORS, DIGIT_TO_WORD, WORD_TO_DIGIT, MAX_PLAYER_NAME_LENGTH } from '../model/constants'
import type { ColorTarget, Digit, NumberTarget, Target, Tile, TileColor } from '../model/types'
import { sanitizePlayerName } from './security'

export function isCorrectTile(tile: Tile, target: Target): boolean {
  if (target.type === 'number') {
    return tile.digit === target.value
  }

  return tile.color === target.targetColor
}

export function validatePlayerName(name: string): string | null {
  const normalized = sanitizePlayerName(name)

  if (!normalized) {
    return null
  }

  if (normalized.length > MAX_PLAYER_NAME_LENGTH) {
    return null
  }

  return normalized
}

export function createInitialTiles(): Tile[] {
  return Array.from({ length: 36 }, (_, index) => ({
    id: `tile-${index}`,
    digit: randomDigit(),
    color: randomColor(),
    version: 1,
    isResolved: false,
  }))
}

export function randomDigit(): Digit {
  return Math.floor(Math.random() * 10) as Digit
}

export function randomColor(): TileColor {
  const index = Math.floor(Math.random() * COLORS.length)
  return COLORS[index]
}

export function regenerateTile(tile: Tile): Tile {
  return {
    ...tile,
    digit: randomDigit(),
    color: randomColor(),
    version: tile.version + 1,
    isResolved: false,
  }
}

export function resolveTile(tile: Tile): Tile {
  return {
    ...tile,
    isResolved: true,
  }
}

export function refreshResolvedTiles(tiles: Tile[]): Tile[] {
  return tiles.map((tile) =>
    tile.isResolved
      ? {
          ...tile,
          digit: randomDigit(),
          color: randomColor(),
          version: tile.version + 1,
          isResolved: false,
        }
      : tile,
  )
}

export function findMatchingTileIds(tiles: Tile[], target: Target): string[] {
  return tiles.filter((tile) => isCorrectTile(tile, target)).map((tile) => tile.id)
}

export function createRandomTarget(tiles: Tile[]): { target: Target; targetTileIds: Set<string> } {
  return createTargetFromType(Math.random() < 0.5 ? 'number' : 'color', tiles)
}

export function createTargetFromType(
  type: 'number' | 'color',
  tiles: Tile[],
): { target: Target; targetTileIds: Set<string> } {
  // 1. Gather only active, unresolved tiles to avoid targeting cleared pieces
  const activeTiles = tiles.filter((tile) => !tile.isResolved)

  // 2. Absolute safety fallback if the board is completely empty or completely cleared
  if (activeTiles.length === 0) {
    if (type === 'number') {
      const fallbackTarget: NumberTarget = { type: 'number', word: 'ZERO', value: 0 }
      return { target: fallbackTarget, targetTileIds: new Set() }
    } else {
      const fallbackTarget: ColorTarget = { type: 'color', word: 'RED', targetColor: 'red' as TileColor }
      return { target: fallbackTarget, targetTileIds: new Set() }
    }
  }

  // 3. Pick a random active tile from the board to guarantee a valid match baseline
  const baseTile = activeTiles[Math.floor(Math.random() * activeTiles.length)]

  // 4. Construct the verified target based on the requested type
  if (type === 'number') {
    const value = baseTile.digit
    const target: NumberTarget = {
      type: 'number',
      word: DIGIT_TO_WORD[value],
      value,
    }
    return { target, targetTileIds: new Set(findMatchingTileIds(tiles, target)) }
  }

  // type === 'color'
  const targetColor = baseTile.color
  const word = randomColorWord() // The word is cosmetic; match logic only checks targetColor
  const target: ColorTarget = {
    type: 'color',
    word,
    targetColor,
  }
  return { target, targetTileIds: new Set(findMatchingTileIds(tiles, target)) }
}


export function calculateAccuracy(correct: number, incorrect: number): number {
  const total = correct + incorrect

  if (total === 0) {
    return 0
  }

  return Math.round((correct / total) * 100)
}

export function completeTarget(targetTileIds: Set<string>, completedTargetTileIds: Set<string>): boolean {
  for (const tileId of targetTileIds) {
    if (!completedTargetTileIds.has(tileId)) {
      return false
    }
  }

  return targetTileIds.size > 0
}

export function getNextTargetType(): 'number' | 'color' {
  return Math.random() < 0.5 ? 'number' : 'color'
}

export function getWordToDigit(word: string): Digit | undefined {
  return WORD_TO_DIGIT[word as keyof typeof WORD_TO_DIGIT]
}

export function createColorTarget(): ColorTarget {
  const word = randomColorWord()
  const targetColor = randomColor()
  return { type: 'color', word, targetColor }
}

export function createNumberTarget(): NumberTarget {
  const value = randomDigit()
  return { type: 'number', word: DIGIT_TO_WORD[value], value }
}

export function randomColorWord(): 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' {
  const words = ['RED', 'BLUE', 'GREEN', 'YELLOW'] as const
  return words[Math.floor(Math.random() * words.length)]
}
