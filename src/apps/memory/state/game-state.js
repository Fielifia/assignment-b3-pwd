import { createTileValues } from '../utils/board-utils.js'
/**
 *@typedef {object} GameState
 * @property {Array<{id:number, value:string, matched:boolean}>} board - The array representing the game board tiles
 * @property {Array<{tile: object, el: HTMLElement}>} flipped - Currently flipped tiles
 * @property {number} matches - Number of matches found
 * @property {number} attempts - Number of attempts made
 * @property {number} time - Time elapsed in seconds
 * @property {number|null} timerId - ID of the interval timer
 * @property {boolean} isBusy - Wether the game is currently processing a flip
 * @property {number|null} level - Current game level
 * @property {boolean} gameOver - Flag indicating if the game is over
 */

/**
 * Creates the initial game state for the memory game.
 *
 * @returns {GameState} The initial game state.
 */
export function createInitialState () {
  return {
    board: [],
    flipped: [],
    matches: 0,
    attempts: 0,
    time: 0,
    timerId: null,
    isBusy: false,
    level: null,
    gameOver: false
  }
}

/**
 * Initializes a new game state for a given level.
 *
 * Resets the state and creates a new suffled board.
 *
 * @param {GameState} state - The current game state.
 * @param {number} level - Selected game level.
 * @returns {void}
 */
export function initGameState (state, level) {
  resetState(state)
  state.level = level
  state.board = createTileValues(level)
}

/**
 * Resets the internal game state to its initial values.
 *
 * Stops the timer, clears the board, flipped tiles,
 * matches, attempts, time, and gameOver flag.
 *
 * @param {GameState} state - The current game state to reset.
 * @returns  {void}
 */
export function resetState (state) {
  state.board = []
  state.flipped = []
  state.matches = 0
  state.attempts = 0
  state.time = 0
  state.timerId = null
  state.isBusy = false
  state.gameOver = false
}
