import { useEffect, useRef } from 'react'

interface InstructionsModalProps {
  isOpen: boolean
  onStart: () => void
  buttonLabel?: 'START' | 'RESUME'
}

export function InstructionsModal({ isOpen, onStart, buttonLabel = 'START' }: InstructionsModalProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      buttonRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="instructions-title">
      <form
        className="modal-card"
        onSubmit={(event) => {
          event.preventDefault()
          onStart()
        }}
      >
        <h2 id="instructions-title">HOW TO PLAY</h2>
        <ul className="instruction-list">
          <li>You have exactly 60 seconds.</li>
          <li>Follow the target shown above the grid.</li>
          <li>NUMBER targets: click every tile with the requested digit.</li>
          <li>COLOR targets: ignore the word and click every tile whose color matches the target font color.</li>
          <li>Correct tile: +1.</li>
          <li>Wrong tile: -1.</li>
          <li>Every clicked tile changes its digit and color.</li>
          <li>Complete every currently matching target tile to receive the next target.</li>
          <li>The game automatically ends at 0 seconds.</li>
        </ul>
        <div className="modal-actions">
          <button ref={buttonRef} type="submit" className="primary-button">
            {buttonLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
