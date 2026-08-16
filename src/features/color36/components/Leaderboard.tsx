import type { LeaderboardEntry } from '../model/types'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  onClear: () => void
}

export function Leaderboard({ entries, onClear }: LeaderboardProps) {
  return (
    <div className="leaderboard-card">
      <div className="leaderboard-header">
        <h3>LOCAL LEADERBOARD</h3>
        <button type="button" className="ghost-button" onClick={onClear}>
          CLEAR LOCAL LEADERBOARD
        </button>
      </div>
      {entries.length === 0 ? (
        <p className="empty-leaderboard">No scores yet. Start a run to set the pace.</p>
      ) : (
        <ol className="leaderboard-list">
          {entries.map((entry, index) => (
            <li key={`${entry.playerName}-${entry.createdAt}-${index}`} className="leaderboard-row">
              <span>{index + 1}. {entry.playerName}</span>
              <span>{entry.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
