interface GameHudProps {
  playerName: string
  score: number
  timeRemaining: number
  onShowInstructions: () => void
}

export function GameHud({ playerName, score, timeRemaining, onShowInstructions }: GameHudProps) {
  return (
    <header className="game-hud">
      <div className="hud-title">COLOR36</div>
      <button type="button" className="secondary-button" onClick={onShowInstructions}>
        [ INSTRUCTIONS ]
      </button>
      <div className="hud-row">
        <span>Player: {playerName}</span>
        <span>Score: {score}</span>
        <span className={timeRemaining <= 10 ? 'timer-warning' : ''}>Time: {timeRemaining} sec</span>
      </div>
    </header>
  )
}
