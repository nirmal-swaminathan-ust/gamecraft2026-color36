import { MAX_SCORE, MIN_SCORE, GAME_DURATION_SECONDS, MAX_PLAYER_NAME_LENGTH } from '../model/constants'
import type { LeaderboardEntry } from '../model/types'

/**
 * Generate a checksum for game data to detect tampering
 * Uses a simple hash-like mechanism to verify data integrity
 */
export function generateGameChecksum(
  playerName: string,
  score: number,
  correctClicks: number,
  incorrectClicks: number,
  completedTargets: number,
  createdAt: string,
): string {
  // Create a string representation of the game data
  const dataString = `${playerName}|${score}|${correctClicks}|${incorrectClicks}|${completedTargets}|${createdAt}`

  // Simple checksum using character codes (for browser compatibility without crypto)
  let checksum = 0
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i)
    checksum = (checksum << 5) - checksum + char
    checksum = checksum & checksum // Convert to 32-bit integer
  }

  return Math.abs(checksum).toString(16)
}

/**
 * Validate that a leaderboard entry is consistent with its game data
 */
export function validateGameChecksum(entry: LeaderboardEntry): boolean {
  if (!entry.gameChecksum || entry.correctClicks === undefined || entry.incorrectClicks === undefined) {
    return false
  }

  const expectedChecksum = generateGameChecksum(
    entry.playerName,
    entry.score,
    entry.correctClicks,
    entry.incorrectClicks,
    entry.completedTargets || 0,
    entry.createdAt,
  )

  return entry.gameChecksum === expectedChecksum
}

/**
 * Validate score is within reasonable bounds
 */
export function isValidScore(score: number): boolean {
  if (!Number.isFinite(score)) {
    return false
  }

  // Score must be an integer
  if (!Number.isInteger(score)) {
    return false
  }

  // Score must be within valid range
  if (score < MIN_SCORE || score > MAX_SCORE) {
    return false
  }

  return true
}

/**
 * Validate game statistics consistency
 */
export function validateGameStats(
  score: number,
  correctClicks: number,
  incorrectClicks: number,
  completedTargets: number,
): boolean {
  // All must be non-negative integers
  if (!Number.isInteger(correctClicks) || correctClicks < 0) {
    return false
  }
  if (!Number.isInteger(incorrectClicks) || incorrectClicks < 0) {
    return false
  }
  if (!Number.isInteger(completedTargets) || completedTargets < 0) {
    return false
  }

  // Score should match correct and incorrect clicks
  const calculatedScore = correctClicks - incorrectClicks
  if (score !== calculatedScore) {
    return false
  }

  // Sanity check: total clicks shouldn't exceed game duration * 6 (6 tiles per row max realistic clicks per second)
  const totalClicks = correctClicks + incorrectClicks
  if (totalClicks > GAME_DURATION_SECONDS * 6) {
    return false
  }

  // Completed targets shouldn't exceed total clicks / 2 (rough estimate)
  if (completedTargets > totalClicks) {
    return false
  }

  return true
}

/**
 * Enhanced validation for leaderboard entries
 */
export function isValidLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>

  // Validate player name
  if (typeof record.playerName !== 'string') {
    return false
  }

  const playerName = record.playerName.trim()
  if (playerName.length === 0 || playerName.length > MAX_PLAYER_NAME_LENGTH) {
    return false
  }

  // Validate score
  if (typeof record.score !== 'number' || !isValidScore(record.score)) {
    return false
  }

  // Validate timestamp
  if (typeof record.createdAt !== 'string') {
    return false
  }

  try {
    const timestamp = new Date(record.createdAt).getTime()
    if (!Number.isFinite(timestamp) || timestamp > Date.now()) {
      return false // Reject future timestamps
    }
    // Reject entries older than 30 days (optional security measure)
    if (Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000) {
      return false
    }
  } catch {
    return false
  }

  // If game stats are provided, validate them
  if (record.correctClicks !== undefined || record.incorrectClicks !== undefined) {
    const correctClicks = record.correctClicks as number
    const incorrectClicks = record.incorrectClicks as number
    const completedTargets = (record.completedTargets as number) || 0

    if (
      typeof correctClicks !== 'number' ||
      typeof incorrectClicks !== 'number' ||
      typeof completedTargets !== 'number'
    ) {
      return false
    }

    if (!validateGameStats(record.score, correctClicks, incorrectClicks, completedTargets)) {
      return false
    }

    // Validate checksum if provided
    if (record.gameChecksum) {
      if (!validateGameChecksum(record as unknown as LeaderboardEntry)) {
        return false
      }
    }
  }

  return true
}

/**
 * Sanitize player name to prevent XSS and injection attacks
 */
export function sanitizePlayerName(name: string): string {
  let sanitized = name.trim()

  // Remove any HTML/XML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '')

  // Remove special characters except spaces and hyphens
  sanitized = sanitized.replace(/[^\w\s\-]/g, '')

  // Limit length
  sanitized = sanitized.substring(0, MAX_PLAYER_NAME_LENGTH)

  // Remove leading/trailing spaces
  sanitized = sanitized.trim()

  return sanitized
}
