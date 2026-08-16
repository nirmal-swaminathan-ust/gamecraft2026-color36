import { GameTile } from './GameTile'
import type { Tile } from '../model/types'

interface GameBoardProps {
  tiles: Tile[]
  onTileClick: (tileId: string) => void
  disabled: boolean
  feedback: Array<{ id: string; tileId: string; type: 'plus' | 'minus' }>
}

export function GameBoard({ tiles, onTileClick, disabled, feedback }: GameBoardProps) {
  return (
    <div className="game-board" role="grid" aria-label="Game board">
      {tiles.map((tile) => {
        const tileFeedback = feedback.find((entry) => entry.tileId === tile.id)

        return (
          <div key={tile.id} className="tile-shell">
            <GameTile tile={tile} onClick={onTileClick} disabled={disabled} />
            {tileFeedback ? (
              <span className={`score-burst ${tileFeedback.type === 'plus' ? 'plus' : 'minus'}`} aria-live="polite">
                {tileFeedback.type === 'plus' ? '+1' : '-1'}
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
