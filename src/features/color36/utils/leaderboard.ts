import type { LeaderboardEntry } from '../model/types'
import { STORAGE_KEY } from '../model/constants'
import { isValidLeaderboardEntry, generateGameChecksum } from './security'

export function compareLeaderboardEntries(a: LeaderboardEntry, b: LeaderboardEntry): number {
  return b.score - a.score || a.createdAt.localeCompare(b.createdAt)
}

export function sortLeaderboardEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries]
    .filter(isValidLeaderboardEntry)
    .sort(compareLeaderboardEntries)
    .slice(0, 10)
}

export function loadLeaderboard(rawInput?: string): LeaderboardEntry[] {
  const raw = rawInput ?? globalThis.localStorage?.getItem(STORAGE_KEY) ?? null

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return sortLeaderboardEntries(parsed as LeaderboardEntry[])
  } catch {
    return []
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 10)))
  } catch {
    // Ignore storage errors and keep the game playable.
  }
}

export function addLeaderboardEntry(
  playerName: string,
  score: number,
  correctClicks: number,
  incorrectClicks: number,
  completedTargets: number,
): LeaderboardEntry[] {
  const createdAt = new Date().toISOString()

  // Generate checksum for data integrity
  const gameChecksum = generateGameChecksum(playerName, score, correctClicks, incorrectClicks, completedTargets, createdAt)

  const entry: LeaderboardEntry = {
    playerName,
    score,
    createdAt,
    correctClicks,
    incorrectClicks,
    completedTargets,
    gameChecksum,
    version: 1,
  }

  const existing = loadLeaderboard()
  const next = [...existing, entry].filter(isValidLeaderboardEntry)
  const sorted = sortLeaderboardEntries(next)
  saveLeaderboard(sorted)
  return sorted
}
