import type { Tile } from '../model/types'
import { TILE_COLORS } from '../model/constants'

interface GameTileProps {
  tile: Tile
  onClick: (tileId: string) => void
  disabled: boolean
}

export function GameTile({ tile, onClick, disabled }: GameTileProps) {
  const isResolvedState = tile.isResolved

  return (
    <button
      type="button"
      className={`game-tile ${isResolvedState ? 'resolved' : ''}`}
      style={{ backgroundColor: isResolvedState ? '#000000' : TILE_COLORS[tile.color] }}
      onClick={() => onClick(tile.id)}
      disabled={disabled || isResolvedState}
      aria-label={isResolvedState ? 'Resolved tile' : `Tile ${tile.digit}, ${tile.color}`}
    >
      {!isResolvedState ? <span className="game-tile-digit">{tile.digit}</span> : null}
    </button>
  )
}
