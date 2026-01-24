import { playFlipSound, playMatchSound } from '../../../ui/sounds.js'
/**
 * Handles a tile flip.
 * Flips the tile, checks for matches and updates state.
 *
 * @param {object} state - Current game state.
 * @param {{id: number, value: string, matched: boolean}} tile - The tile object
 * @param {HTMLElement} tileEl - The tile DOM element.
 * @param {(state: object) =>  void} checkMatchCallback - Callback to check for a match.
 * @returns {void}
 */
export function flipTile (state, tile, tileEl, checkMatchCallback) {
  if (
    state.isBusy ||
    tile.matched ||
    state.flipped.some((f) => f.tile === tile)
  ) { return }

  tileEl.classList.add('flip')
  state.flipped.push({ tile, el: tileEl })
  playFlipSound()

  if (state.flipped.length === 2) {
    state.isBusy = true
    state.attempts++

    setTimeout(() => {
      checkMatchCallback(state)
      state.isBusy = false
    }, 500)
  }
}

/**
 * Checks if the two flipped tiles match.
 * Updates matches state and clears flipped array.
 *
 * @param {object} state - Current game state.
 * @param {() => void} gameOverCallback - Callback when the game is over.
 * @returns {void}
 */
export function checkMatch (state, gameOverCallback) {
  const [first, second] = state.flipped
  if (!first || !second) return

  if (first.tile.value === second.tile.value) {
    first.tile.matched = true
    second.tile.matched = true
    state.matches++

    setTimeout(() => {
      first.el.classList.add('matched')
      second.el.classList.add('matched')
      playMatchSound()
    }, 400)
  } else {
    first.el.classList.remove('flip')
    second.el.classList.remove('flip')
  }

  state.flipped = []

  if (state.matches === state.board.length / 2) {
    setTimeout(gameOverCallback, 1000)
  }
}
