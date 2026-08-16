import type { LeaderboardEntry } from '../model/types'
import { STORAGE_KEY } from '../model/constants'

export function isValidLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>

  return (
    typeof record.playerName === 'string' &&
    record.playerName.trim().length > 0 &&
    typeof record.score === 'number' &&
    Number.isFinite(record.score) &&
    typeof record.createdAt === 'string'
  )
}

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

export function addLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  const existing = loadLeaderboard()
  const next = [...existing, entry].filter(isValidLeaderboardEntry)
  const sorted = sortLeaderboardEntries(next)
  saveLeaderboard(sorted)
  return sorted
}
