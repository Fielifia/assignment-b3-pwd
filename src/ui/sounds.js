let flipSound
let matchSound
let winnerSound

/**
 * Plays the flip sound effect for a card.
 * Lazy-loads the sound the first time it is played using Howler.js.
 *
 * @returns {void}
 */
export function playFlipSound () {
  if (!flipSound) {
    flipSound = new window.Howl({ src: ['sounds/flip.mp3'] })
  }
  flipSound.play()
}

/**
 * Plays the match sound effect when a pair is found.
 * Lazy-loads the souns the first time it is played using Howler.js.
 *
 * @returns {void}
 */
export function playMatchSound () {
  if (!matchSound) {
    matchSound = new window.Howl({ src: ['sounds/yey.mp3'] })
  }
  matchSound.play()
}

/**
 * Plays the winner sound effect when the game is completed.
 * Lazy-loads the sound the first time it is played using Howler.js.
 *
 * @returns  {void}
 */
export function playWinnerSound () {
  if (!winnerSound) {
    winnerSound = new window.Howl({ src: ['sounds/win.mp3'] })
  }
  winnerSound.play()
}
