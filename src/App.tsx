import { useEffect, useMemo, useReducer, useState } from 'react'
import './App.css'
import { GameBoard } from './features/color36/components/GameBoard'
import { GameHud } from './features/color36/components/GameHud'
import { GameOverScreen } from './features/color36/components/GameOverScreen'
import { InstructionsModal } from './features/color36/components/InstructionsModal'
import { Leaderboard } from './features/color36/components/Leaderboard'
import { TargetPanel } from './features/color36/components/TargetPanel'
import { WelcomeScreen } from './features/color36/components/WelcomeScreen'
import { getInitialGameState, gameReducer } from './features/color36/model/gameReducer'
import { addLeaderboardEntry, loadLeaderboard, saveLeaderboard } from './features/color36/utils/leaderboard'
import { calculateAccuracy, validatePlayerName } from './features/color36/utils/gameLogic'

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialGameState)
  const [nameInput, setNameInput] = useState('')
  const [nameError, setNameError] = useState('')
  const [leaderboard, setLeaderboard] = useState(() => loadLeaderboard())
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [scoreFeedback, setScoreFeedback] = useState<Array<{ id: string; tileId: string; type: 'plus' | 'minus' }>>([])

  useEffect(() => {
    if (state.status !== 'playing') {
      return undefined
    }

    const interval = window.setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [state.status])

  useEffect(() => {
    if (state.status !== 'finished') {
      return
    }

    const entry = {
      playerName: state.playerName,
      score: state.score,
      createdAt: new Date().toISOString(),
    }

    const updated = addLeaderboardEntry(entry)
    setLeaderboard(updated)
  }, [state.status, state.playerName, state.score])

  const personalBest = useMemo(() => {
    const matches = leaderboard.filter((entry) => entry.playerName.toLowerCase() === state.playerName.toLowerCase())
    return matches.length > 0 ? Math.max(...matches.map((entry) => entry.score)) : 0
  }, [leaderboard, state.playerName])

  const targetProgress = useMemo(() => {
    if (!state.target || state.targetTileIds.size === 0) {
      return ''
    }

    const completed = Array.from(state.targetTileIds).filter((tileId) => state.completedTargetTileIds.has(tileId)).length
    return `${completed} / ${state.targetTileIds.size}`
  }, [state.completedTargetTileIds, state.target, state.targetTileIds])

  const triggerFeedback = (tileId: string, type: 'plus' | 'minus') => {
    const id = `${tileId}-${Date.now()}-${Math.random()}`
    setScoreFeedback((current) => [...current, { id, tileId, type }])

    window.setTimeout(() => {
      setScoreFeedback((current) => current.filter((entry) => entry.id !== id))
    }, 500)
  }

  const handleContinue = () => {
    const trimmed = validatePlayerName(nameInput)
    if (!trimmed) {
      setNameError('Please enter your name.')
      return
    }

    setNameError('')
    dispatch({ type: 'SUBMIT_PLAYER_NAME', playerName: trimmed })
  }

  const handleStartGame = () => {
    dispatch({ type: 'START_GAME' })
  }

  const handleTileClick = (tileId: string) => {
    if (state.status !== 'playing') {
      return
    }

    const isCorrect = state.targetTileIds.has(tileId)
    dispatch({ type: 'CLICK_TILE', tileId })
    triggerFeedback(tileId, isCorrect ? 'plus' : 'minus')
  }

  const handleToggleInstructions = () => {
    if (state.showInstructions) {
      dispatch({ type: 'CLOSE_INSTRUCTIONS' })
      return
    }

    dispatch({ type: 'OPEN_INSTRUCTIONS' })
  }

  const handleReplay = () => {
    dispatch({ type: 'REPLAY' })
    setShowLeaderboard(false)
  }

  const clearLeaderboard = () => {
    const confirmed = window.confirm('Clear all locally stored scores?')
    if (!confirmed) {
      return
    }

    saveLeaderboard([])
    setLeaderboard([])
  }

  if (state.status === 'welcome') {
    return (
      <div className="app-shell">
        <WelcomeScreen name={nameInput} setName={setNameInput} error={nameError} onContinue={handleContinue} />
      </div>
    )
  }

  if (state.status === 'instructions') {
    return (
      <div className="app-shell">
        <InstructionsModal
          isOpen={state.showInstructions}
          onClose={() => dispatch({ type: 'CLOSE_INSTRUCTIONS' })}
          onStart={handleStartGame}
        />
        <div className="screen-shell">
          <div className="panel-card info-panel">
            <h2>READY TO PLAY?</h2>
            <p>Welcome, {state.playerName}. Press start when you're ready.</p>
            <button type="button" className="primary-button" onClick={handleStartGame}>
              START GAME
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (state.status === 'finished') {
    return (
      <div className="app-shell">
        <GameOverScreen
          playerName={state.playerName}
          score={state.score}
          correctClicks={state.correctClicks}
          incorrectClicks={state.incorrectClicks}
          completedTargets={state.completedTargets}
          onReplay={handleReplay}
          onViewLeaderboard={() => setShowLeaderboard(true)}
          personalBest={personalBest}
          entries={leaderboard}
        />
        {showLeaderboard ? <Leaderboard entries={leaderboard} onClear={clearLeaderboard} /> : null}
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="game-shell">
        <GameHud
          playerName={state.playerName}
          score={state.score}
          timeRemaining={state.timeRemaining}
          onShowInstructions={handleToggleInstructions}
        />

        <div className="visual-stack">
          <TargetPanel target={state.target} progressText={targetProgress ? `TARGET PROGRESS ${targetProgress}` : undefined} />

          <GameBoard
            tiles={state.tiles}
            onTileClick={handleTileClick}
            disabled={state.showInstructions}
            feedback={scoreFeedback}
          />
        </div>

        <div className="stats-strip">
          <div className="stat-card">
            <span>Score</span>
            <strong>{state.score}</strong>
          </div>
          <div className="stat-card">
            <span>Accuracy</span>
            <strong>{calculateAccuracy(state.correctClicks, state.incorrectClicks)}%</strong>
          </div>
          <div className="stat-card">
            <span>Targets</span>
            <strong>{state.completedTargets}</strong>
          </div>
        </div>

        {showLeaderboard ? <Leaderboard entries={leaderboard} onClear={clearLeaderboard} /> : null}
      </div>

      {state.showInstructions ? (
        <InstructionsModal
          isOpen={state.showInstructions}
          onClose={() => dispatch({ type: 'CLOSE_INSTRUCTIONS' })}
          onStart={handleStartGame}
        />
      ) : null}
    </div>
  )
}

export default App
