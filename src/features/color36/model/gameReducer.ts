import {
  createInitialTiles,
  createRandomTarget,
  createTargetFromType,
  getNextTargetType,
  isCorrectTile,
  refreshResolvedTiles,
  resolveTile,
  validatePlayerName,
} from '../utils/gameLogic'
import type { GameAction, GameState, Target, Tile } from './types'

export function getInitialGameState(): GameState {
  return {
    status: 'welcome',
    playerName: '',
    score: 0,
    timeRemaining: 60,
    tiles: createInitialTiles(),
    target: null,
    targetTileIds: new Set(),
    completedTargetTileIds: new Set(),
    correctClicks: 0,
    incorrectClicks: 0,
    completedTargets: 0,
    showInstructions: false,
    finalResultRecorded: false,
  }
}

function beginFreshRound(state: GameState): GameState {
  const freshTiles = createInitialTiles()
  const targetData = createRandomTarget(freshTiles)

  return {
    ...state,
    status: 'playing',
    timeRemaining: 60,
    score: 0,
    correctClicks: 0,
    incorrectClicks: 0,
    completedTargets: 0,
    tiles: freshTiles,
    target: targetData.target,
    targetTileIds: targetData.targetTileIds,
    completedTargetTileIds: new Set(),
    showInstructions: false,
    finalResultRecorded: false,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SUBMIT_PLAYER_NAME': {
      const sanitized = validatePlayerName(action.playerName)
      if (!sanitized) {
        return state
      }

      return {
        ...state,
        playerName: sanitized,
        status: 'instructions',
        showInstructions: true,
      }
    }
    case 'SHOW_INSTRUCTIONS': {
      return {
        ...state,
        status: 'instructions',
        showInstructions: true,
      }
    }
    case 'OPEN_INSTRUCTIONS': {
      return {
        ...state,
        showInstructions: true,
      }
    }
    case 'CLOSE_INSTRUCTIONS': {
      return {
        ...state,
        showInstructions: false,
        status: state.status === 'finished' ? 'finished' : 'playing',
      }
    }
    case 'START_GAME': {
      if (state.status === 'welcome' || state.status === 'instructions' || state.status === 'finished') {
        const freshTiles = createInitialTiles()
        const targetData = createRandomTarget(freshTiles)

        return {
          ...state,
          status: 'playing',
          score: 0,
          timeRemaining: 60,
          tiles: freshTiles,
          target: targetData.target,
          targetTileIds: targetData.targetTileIds,
          completedTargetTileIds: new Set(),
          correctClicks: 0,
          incorrectClicks: 0,
          completedTargets: 0,
          showInstructions: false,
          finalResultRecorded: false,
        }
      }

      return state
    }
    case 'TICK': {
      if (state.status !== 'playing' || state.showInstructions) {
        return state
      }

      if (state.timeRemaining <= 1) {
        return {
          ...state,
          timeRemaining: 0,
          status: 'finished',
          showInstructions: false,
        }
      }

      return {
        ...state,
        timeRemaining: state.timeRemaining - 1,
      }
    }
    case 'CLICK_TILE': {
      if (state.status !== 'playing' || state.showInstructions || state.target === null) {
        return state
      }

      const selectedTile = state.tiles.find((tile) => tile.id === action.tileId)
      if (selectedTile?.isResolved) {
        return state
      }

      const isTargetMatch = state.targetTileIds.has(action.tileId)
      const nextTiles = state.tiles.map((tile) => (tile.id === action.tileId ? resolveTile(tile) : tile))

      if (isTargetMatch) {
        const nextCompleted = new Set(state.completedTargetTileIds)
        nextCompleted.add(action.tileId)
        const allCompleted = Array.from(state.targetTileIds).every((tileId) => nextCompleted.has(tileId))

        if (allCompleted) {
          const refreshedTiles = refreshResolvedTiles(nextTiles)
          const nextTargetData = createTargetFromType(getNextTargetType(), refreshedTiles)

          return {
            ...state,
            score: state.score + 1,
            correctClicks: state.correctClicks + 1,
            tiles: refreshedTiles,
            target: nextTargetData.target,
            targetTileIds: nextTargetData.targetTileIds,
            completedTargetTileIds: new Set(),
            completedTargets: state.completedTargets + 1,
          }
        }

        return {
          ...state,
          score: state.score + 1,
          correctClicks: state.correctClicks + 1,
          tiles: nextTiles,
          completedTargetTileIds: nextCompleted,
        }
      }

      return {
        ...state,
        score: state.score - 1,
        incorrectClicks: state.incorrectClicks + 1,
        tiles: nextTiles,
      }
    }
    case 'REPLAY': {
      return beginFreshRound({
        ...getInitialGameState(),
        playerName: state.playerName,
      })
    }
    default:
      return state
  }
}

export function makeTargetSnapshot(target: Target, tiles: Tile[]): Set<string> {
  const ids = tiles.filter((tile) => isCorrectTile(tile, target)).map((tile) => tile.id)
  return new Set(ids)
}
