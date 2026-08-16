import { useEffect, useRef, type FormEvent } from 'react'

interface WelcomeScreenProps {
  name: string
  setName: (name: string) => void
  error: string | null
  onContinue: () => void
}

export function WelcomeScreen({ name, setName, error, onContinue }: WelcomeScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // 1. Automatically focus the text input immediately when the component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // 2. Prevent page reload and submit the form when hitting Enter
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Guard clause to ensure empty or whitespace-only entries don't submit accidentally
    if (!name.trim()) return 
    onContinue()
  }

  // 3. Button is disabled if the trimmed name is empty
  const isButtonDisabled = !name.trim()

  return (
    <div className="screen-shell">
      <form className="panel-card welcome-panel" onSubmit={handleSubmit}>
        <p className="welcome-header">Welcome to GameCraft 2026!</p>
        <h1>COLOR36</h1>
        <p className="subtitle">THE 60-SECOND CHALLENGE</p>

        <label className="field-label" htmlFor="player-name">
          Player Name
        </label>
        <input
          ref={inputRef}
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
          Max 10 characters. Letters, numbers, and mid spaces only.
        </p>
        {error ? (
          <p id="player-name-error" className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <button 
          type="submit" 
          className="primary-button"
          disabled={isButtonDisabled}
        >
          CONTINUE
        </button>
      </form>
    </div>
  )
}
