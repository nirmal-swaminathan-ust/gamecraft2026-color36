import { describe, expect, it } from 'vitest'

import {
  calculateAccuracy,
  createInitialTiles,
  createRandomTarget,
  findMatchingTileIds,
  isCorrectTile,
  randomColor,
  randomDigit,
  regenerateTile,
  validatePlayerName,
} from '../src/features/color36/utils/gameLogic'
import { DIGIT_TO_WORD, WORD_TO_DIGIT } from '../src/features/color36/model/constants'
import { gameReducer, getInitialGameState } from '../src/features/color36/model/gameReducer'
import { loadLeaderboard, sortLeaderboardEntries } from '../src/features/color36/utils/leaderboard'

const tile = (overrides: Partial<{
  id: string
  digit: number
  color: 'red' | 'blue' | 'green' | 'yellow'
  version: number
}> = {}) => ({
  id: overrides.id ?? 'tile-1',
  digit: overrides.digit ?? 3,
  color: overrides.color ?? 'red',
  version: overrides.version ?? 1,
})

describe('core utilities', () => {
  it('randomDigit returns a valid digit from 0 to 9', () => {
    const value = randomDigit()
    expect(Number.isInteger(value)).toBe(true)
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThanOrEqual(9)
  })

  it('randomColor returns one of the valid gameplay colors', () => {
    expect(['red', 'blue', 'green', 'yellow']).toContain(randomColor())
  })

  it('createInitialTiles creates 36 tiles with unique ids', () => {
    const tiles = createInitialTiles()
    expect(tiles).toHaveLength(36)
    expect(new Set(tiles.map((item) => item.id)).size).toBe(36)
  })

  it('number target matching is based on digit regardless of color', () => {
    const target = { type: 'number' as const, word: 'THREE', value: 3 }
    expect(isCorrectTile(tile({ digit: 3, color: 'red' }), target)).toBe(true)
    expect(isCorrectTile(tile({ digit: 3, color: 'blue' }), target)).toBe(true)
    expect(isCorrectTile(tile({ digit: 7, color: 'green' }), target)).toBe(false)
  })

  it('color target matching is based on target font color only', () => {
    const target = { type: 'color' as const, word: 'GREEN', targetColor: 'red' }
    expect(isCorrectTile(tile({ color: 'red' }), target)).toBe(true)
    expect(isCorrectTile(tile({ color: 'green' }), target)).toBe(false)
  })

  it('createRandomTarget always resolves to at least one matching tile', () => {
    const tiles = createInitialTiles()
    const target = createRandomTarget(tiles)
    expect(target.targetTileIds.size).toBeGreaterThan(0)
  })

  it('findMatchingTileIds derives original target snapshot IDs', () => {
    const tiles = [
      tile({ id: 'A', digit: 3, color: 'red' }),
      tile({ id: 'B', digit: 3, color: 'yellow' }),
      tile({ id: 'C', digit: 3, color: 'blue' }),
      tile({ id: 'D', digit: 7, color: 'green' }),
    ]

    const target = { type: 'number' as const, word: 'THREE', value: 3 }
    expect(findMatchingTileIds(tiles, target)).toEqual(['A', 'B', 'C'])
  })

  it('regenerateTile changes both digit and color and increments version', () => {
    const before = tile({ id: 'x', digit: 4, color: 'green', version: 2 })
    const after = regenerateTile(before)
    expect(after.id).toBe(before.id)
    expect(after.version).toBe(before.version + 1)
    expect(after.digit).not.toBe(before.digit)
    expect(after.color).not.toBe(before.color)
  })

  it('accuracy is rounded from correct and incorrect totals', () => {
    expect(calculateAccuracy(72, 16)).toBe(82)
    expect(calculateAccuracy(0, 0)).toBe(0)
  })

  it('player names are trimmed and validated', () => {
    expect(validatePlayerName('   Nirmal   ')).toBe('Nirmal')
    expect(validatePlayerName('   ')).toBeNull()
    expect(validatePlayerName('x'.repeat(31))).toBeNull()
  })

  it('digit and word mappings stay consistent', () => {
    expect(DIGIT_TO_WORD[3]).toBe('THREE')
    expect(WORD_TO_DIGIT.THREE).toBe(3)
  })
})

describe('game reducer', () => {
  it('starts a fresh game with 60 seconds and a valid target', () => {
    const state = gameReducer(getInitialGameState(), { type: 'START_GAME' })
    expect(state.status).toBe('playing')
    expect(state.timeRemaining).toBe(60)
    expect(state.score).toBe(0)
    expect(state.target).not.toBeNull()
    expect(state.targetTileIds.size).toBeGreaterThan(0)
  })

  it('ticks down to zero and ends the game', () => {
    let state = gameReducer(getInitialGameState(), { type: 'START_GAME' })
    state = gameReducer(state, { type: 'TICK' })
    expect(state.timeRemaining).toBe(59)

    for (let index = 0; index < 58; index += 1) {
      state = gameReducer(state, { type: 'TICK' })
    }

    expect(state.timeRemaining).toBe(1)
    state = gameReducer(state, { type: 'TICK' })
    expect(state.timeRemaining).toBe(0)
    expect(state.status).toBe('finished')
  })

  it('handles correct and wrong clicks with scoring and blacking the clicked tile', () => {
    let state = {
      ...getInitialGameState(),
      status: 'playing' as const,
      target: { type: 'number' as const, word: 'ONE', value: 1 },
      targetTileIds: new Set(['target-1', 'target-2']),
      completedTargetTileIds: new Set<string>(),
      tiles: [
        { id: 'target-1', digit: 1, color: 'red', version: 1, isResolved: false },
        { id: 'target-2', digit: 1, color: 'blue', version: 1, isResolved: false },
        { id: 'other', digit: 5, color: 'green', version: 1, isResolved: false },
      ],
    }

    state = gameReducer(state, { type: 'CLICK_TILE', tileId: 'target-1' })
    expect(state.score).toBe(1)
    expect(state.correctClicks).toBe(1)
    expect(state.completedTargetTileIds.has('target-1')).toBe(true)
    expect(state.tiles.find((tile) => tile.id === 'target-1')?.isResolved).toBe(true)

    const wrongTile = state.tiles.find((tile) => tile.id === 'other') ?? state.tiles[0]
    const beforeWrong = { ...wrongTile }
    state = gameReducer(state, { type: 'CLICK_TILE', tileId: wrongTile.id })
    expect(state.score).toBe(0)
    expect(state.incorrectClicks).toBe(1)
    expect(state.tiles.find((tile) => tile.id === wrongTile.id)?.isResolved).toBe(true)
    expect(state.tiles.find((tile) => tile.id === wrongTile.id)?.digit).toBe(beforeWrong.digit)
  })

  it('keeps correct tiles black until the full target is resolved, then refreshes the board', () => {
    let state = {
      ...getInitialGameState(),
      status: 'playing' as const,
      target: { type: 'number' as const, word: 'THREE', value: 3 },
      targetTileIds: new Set(['a', 'b', 'c']),
      completedTargetTileIds: new Set(),
      tiles: [
        { id: 'a', digit: 3, color: 'red', version: 1, isResolved: false },
        { id: 'b', digit: 3, color: 'blue', version: 1, isResolved: false },
        { id: 'c', digit: 3, color: 'green', version: 1, isResolved: false },
      ],
    }

    state = gameReducer(state, { type: 'CLICK_TILE', tileId: 'a' })
    expect(state.tiles.find((tile) => tile.id === 'a')?.isResolved).toBe(true)

    state = gameReducer(state, { type: 'CLICK_TILE', tileId: 'b' })
    state = gameReducer(state, { type: 'CLICK_TILE', tileId: 'c' })

    expect(state.completedTargets).toBe(1)
    expect(state.tiles.some((tile) => tile.isResolved)).toBe(false)
    expect(state.targetTileIds.size).toBeGreaterThan(0)
  })

  it('ignores clicks after the game is finished', () => {
    let state = getInitialGameState()
    state = { ...state, status: 'finished', score: 47, correctClicks: 12, incorrectClicks: 4 }

    const originalTiles = [...state.tiles]
    state = gameReducer(state, { type: 'CLICK_TILE', tileId: state.tiles[0].id })
    expect(state.score).toBe(47)
    expect(state.correctClicks).toBe(12)
    expect(state.incorrectClicks).toBe(4)
    expect(state.tiles).toEqual(originalTiles)
  })

  it('resets completely on replay', () => {
    let state = gameReducer(getInitialGameState(), { type: 'START_GAME' })
    state = gameReducer(state, { type: 'CLICK_TILE', tileId: Array.from(state.targetTileIds)[0] })
    state = gameReducer(state, { type: 'REPLAY' })
    expect(state.score).toBe(0)
    expect(state.timeRemaining).toBe(60)
    expect(state.status).toBe('playing')
    expect(state.correctClicks).toBe(0)
    expect(state.incorrectClicks).toBe(0)
    expect(state.completedTargets).toBe(0)
    expect(state.targetTileIds.size).toBeGreaterThan(0)
    expect(state.tiles).toHaveLength(36)
  })
})

describe('leaderboard utilities', () => {
  it('validates and sorts leaderboard entries', () => {
    const entries = [
      { playerName: 'A', score: 10, createdAt: '2024-01-01T00:00:00.000Z' },
      { playerName: 'B', score: 80, createdAt: '2024-01-01T00:00:05.000Z' },
      { playerName: 'C', score: 30, createdAt: '2024-01-01T00:00:03.000Z' },
      { playerName: 'D', score: -5, createdAt: '2024-01-01T00:00:04.000Z' },
      { playerName: 'E', score: 90, createdAt: '2024-01-01T00:00:02.000Z' },
    ] as const

    const sorted = sortLeaderboardEntries(entries)
    expect(sorted[0].playerName).toBe('E')
    expect(sorted[1].playerName).toBe('B')
    expect(sorted[2].playerName).toBe('C')
  })

  it('loads a safe empty array when storage is malformed', () => {
    const result = loadLeaderboard('not valid json')
    expect(result).toEqual([])
  })
})
