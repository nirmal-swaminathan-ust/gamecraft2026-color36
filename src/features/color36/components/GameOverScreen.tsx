import type { LeaderboardEntry } from '../model/types'

interface GameOverScreenProps {
  playerName: string
  score: number
  correctClicks: number
  incorrectClicks: number
  completedTargets: number
  onReplay: () => void
  onViewLeaderboard: () => void
  personalBest: number
  entries: LeaderboardEntry[]
}

export function GameOverScreen({
  playerName,
  score,
  correctClicks,
  incorrectClicks,
  completedTargets,
  onReplay,
  onViewLeaderboard,
  personalBest,
  entries,
}: GameOverScreenProps) {
  const accuracy = correctClicks + incorrectClicks === 0 ? 0 : Math.round((correctClicks / (correctClicks + incorrectClicks)) * 100)

  return (
    <div className="screen-shell">
      <div className="panel-card result-panel">
        <h2>GAME OVER</h2>
        <div className="result-grid">
          <div>
            <span className="result-label">Player</span>
            <strong>{playerName}</strong>
          </div>
          <div>
            <span className="result-label">Final Score</span>
            <strong>{score}</strong>
          </div>
          <div>
            <span className="result-label">Status</span>
            <strong>TIME UP</strong>
          </div>
          <div>
            <span className="result-label">Correct Clicks</span>
            <strong>{correctClicks}</strong>
          </div>
          <div>
            <span className="result-label">Wrong Clicks</span>
            <strong>{incorrectClicks}</strong>
          </div>
          <div>
            <span className="result-label">Accuracy</span>
            <strong>{accuracy}%</strong>
          </div>
          <div>
            <span className="result-label">Targets Completed</span>
            <strong>{completedTargets}</strong>
          </div>
          <div>
            <span className="result-label">Personal Best</span>
            <strong>{personalBest}</strong>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="primary-button" onClick={onReplay}>
            PLAY AGAIN
          </button>
          <button type="button" className="secondary-button" onClick={onViewLeaderboard}>
            LEADERBOARD
          </button>
        </div>

        {entries.length > 0 ? (
          <div className="mini-leaderboard">
            <h3>TOP 10</h3>
            <ol>
              {entries.slice(0, 5).map((entry, index) => (
                <li key={`${entry.playerName}-${entry.createdAt}-${index}`}>
                  {entry.playerName}: {entry.score}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </div>
  )
}
