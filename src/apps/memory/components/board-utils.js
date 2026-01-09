/**
 * Shuffles an array using Fisher-Yates algorithm.
 *
 * @param {Array} arr - The array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffleArray (arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Creates an array of tile objects for the game.
 * Each tile has an id, value and mathed state.
 *
 * @returns {Array<{id: number, value: string, matched: boolean}>} Array of tiles
 */
export function createTileValues () {
  const TILE_VALUES = [
    '🍎',
    '🍌',
    '🍒',
    '🍇',
    '🍉',
    '🥝',
    '🍑',
    '🍍',
    '🥭',
    '🍋',
    '🍊',
    '🍐',
    '🍓',
    '🥥',
    '🍈',
    '🍋‍🟩',
    '🫐',
    '🍏'
  ]
  const needed = this.state.level ** 2 / 2

  const tiles = [
    ...TILE_VALUES.slice(0, needed).concat(TILE_VALUES.slice(0, needed))
  ].map((val, i) => ({
    id: i + 1,
    value: val,
    matched: false
  }))
  return shuffleArray(tiles)
}
