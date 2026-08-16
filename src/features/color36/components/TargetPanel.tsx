import type { Target } from '../model/types'
import { TILE_COLORS } from '../model/constants'

interface TargetPanelProps {
  target: Target | null
  progressText?: string
}

export function TargetPanel({ target, progressText }: TargetPanelProps) {
  if (!target) {
    return null
  }

  const targetWordStyle =
    target.type === 'color' ? { color: TILE_COLORS[target.targetColor] } : { color: '#0f172a' }

  return (
    <div className="target-panel" aria-live="polite">
      <div className="target-label">TARGET: {target.type.toUpperCase()}</div>
      <div className="target-word" style={targetWordStyle}>{target.word}</div>
      {progressText ? <div className="target-progress">{progressText}</div> : null}
    </div>
  )
}
