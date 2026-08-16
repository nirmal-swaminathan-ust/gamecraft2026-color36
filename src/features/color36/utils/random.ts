import type { Digit, TileColor } from '../model/types'
import { COLOR_WORDS, COLORS, DIGIT_TO_WORD } from '../model/constants'

export function randomDigit(): Digit {
  return Math.floor(Math.random() * 10) as Digit
}

export function randomColor(): TileColor {
  const index = Math.floor(Math.random() * COLORS.length)
  return COLORS[index]
}

export function randomNumberWord(): keyof typeof DIGIT_TO_WORD {
  const values = Object.keys(DIGIT_TO_WORD) as unknown as Array<keyof typeof DIGIT_TO_WORD>
  return values[Math.floor(Math.random() * values.length)]
}

export function randomColorWord(): (typeof COLOR_WORDS)[number] {
  const words = COLOR_WORDS
  return words[Math.floor(Math.random() * words.length)]
}
