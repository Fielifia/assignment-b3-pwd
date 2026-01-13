/**
 * Starts the game timer.
 * Updates `state.time` every second and calls the onTick callback.
 *
 * @param {object} state - The current game state
 * @param {Function} onTick - Callback function called every second
 * @returns {void}
 */
export function startTimer (state, onTick) {
  stopTimer(state)
  state.timerId = setInterval(() => {
    state.time++
    onTick()
  }, 1000)
}

/**
 * Stops the timer if running.
 * Clears the interval and sets `state.timerId` to null.
 *
 * @param {object} state - The current game state
 * @returns {void}
 */
export function stopTimer (state) {
  if (!state.timerId) return
  clearInterval(state.timerId)
  state.timerId = null
}
