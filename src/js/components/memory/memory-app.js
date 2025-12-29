/**
 * Memory Game Web Component.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 1.0.0
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
@import './memory-app.css
</style>
<div class="memory-game">
<p>Memory Game placeholder</p>
</div>
`
/**
 * Custom element <memory-app> representing a Memory Game.
 *
 * @class
 * @augments HTMLElement
 */
class MemoryApp extends HTMLElement {
  /**
   * Creates an instance of MemoryApp
   * Initializes shadow DOM and the initial game state.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    /**
     * Internal state of the game
     *
     * @type {object}
     * @property {Array} board - The array representing the board tiles.
     * @property {Array} flipped - Currently flipped tiles.
     * @property {number} matches - Numbver of matches found.
     * @property {number} attempts - Number of flip attempts.
     */
    this.state = {
      board: [],
      flipped: [],
      matches: 0,
      attempts: 0
    }
  }

  /**
   * Called when the component is added to the DOM.
   * Initilizes the game.
   *
   * @returns {void}
   */
  connectedCallback () {
    this.initGame()
  }

  /**
   * Initializes the memory game.
   * Creates the board, shuffle tiles, and resets game state.
   *
   * @returns {void}
   */
  initGame () {
    console.log('Memory game initialized!')
    // TODO: Add logic
  }
}

customElements.define('memory-app', MemoryApp)
