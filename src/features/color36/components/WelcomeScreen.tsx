interface WelcomeScreenProps {
  name: string
  setName: (value: string) => void
  error: string
  onContinue: () => void
}

export function WelcomeScreen({ name, setName, error, onContinue }: WelcomeScreenProps) {
  return (
    <div className="screen-shell">
      <div className="panel-card welcome-panel">
        <p className="welcome-header">Welcome to GameCraft 2026!</p>
        <h1>COLOR36</h1>
        <p className="subtitle">THE 60-SECOND CHALLENGE</p>

        <label className="field-label" htmlFor="player-name">
          Player Name
        </label>
        <input
          id="player-name"
          type="text"
          className="name-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={10}
          placeholder="Enter your name"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'player-name-error' : 'player-name-hint'}
        />
        <p id="player-name-hint" className="form-hint">
          Maximum 10 characters
        </p>
        {error ? (
          <p id="player-name-error" className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="button" className="primary-button" onClick={onContinue}>
          CONTINUE
        </button>
      </div>
    </div>
  )
}
