interface InstructionsModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: () => void
}

export function InstructionsModal({ isOpen, onClose, onStart }: InstructionsModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="instructions-title">
      <div className="modal-card">
        <h2 id="instructions-title">HOW TO PLAY</h2>
        <ul className="instruction-list">
          <li>You have exactly 60 seconds.</li>
          <li>Follow the target shown below the grid.</li>
          <li>NUMBER targets: click every tile with the requested digit.</li>
          <li>COLOR targets: ignore the word and click every tile whose color matches the target font color.</li>
          <li>Correct tile: +1.</li>
          <li>Wrong tile: -1.</li>
          <li>Every clicked tile changes its digit and color.</li>
          <li>Complete every currently matching target tile to receive the next target.</li>
          <li>The game automatically ends at 0 seconds.</li>
        </ul>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            CLOSE
          </button>
          <button type="button" className="primary-button" onClick={onStart}>
            START GAME
          </button>
        </div>
      </div>
    </div>
  )
}
