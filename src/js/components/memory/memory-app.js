/**
 * Memory Game Web Component.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 1.0.0
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
.memory-game {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    font-size: 1.2rem;
    width: 100%;
}

.tile {
    width: 60px;
    height: 60px;
    border: 2px solid black;
    border-radius: 6px;
    background: linear-gradient(135deg, #8cadc2, #c8d7e4);
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    cursor: pointer;
    user-select: none;
    transition: .3s ease-in-out;
}

.tile:hover {
  background: linear-gradient(135deg, #7fa3bb, #d5e2ec);
  transform: translateY(-1px) scale(1.01);
}
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
    this.state.board = this.createTiles()
    this.state.matches = 0
    this.state.attempts = 0
    this.renderBoard()
  }

  /**
   * Creates an array of tile objects for the game.
   * Each tile has an id, value and mathed state.
   *
   * @returns {Array<{id: number, value: string, matched: boolean}>} Array of tiles
   */
  createTiles () {
    const values = ['🍎', '🍌', '🍒', '🍇', '🍉', '🥝', '🍑', '🍍']
    const tiles = values.concat(values) // Duplicate
      .map((val, i) => ({ id: i + 1, value: val, matched: false }))
    return this.shuffleArray(tiles)
  }

  /**
   * Shuffles an array using Fisher-Yates algorithm.
   *
   * @param {Array} arr - The array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray (arr) {
    const a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  /**
   * Renders the board inside the component.
   *
   * @returns {void}
   */
  renderBoard () {
    const container = this.shadowRoot.querySelector('.memory-game')
    container.innerHTML = ''
    this.state.board.forEach(tile => {
      const tileEl = document.createElement('div')
      tileEl.classList.add('tile')
      tileEl.dataset.id = tile.id
      tileEl.textContent = tile.matched ? tile.value : ''
      tileEl.addEventListener('click', () => this.flipTile(tile, tileEl))
      container.appendChild(tileEl)
    })
  }

  /**
   * Handles a tile flip.
   * Flips the tile, checks for matches and updates state.
   *
   * @param {{id: number, value: string, matched: boolean}} tile - The tile object
   * @param {HTMLElement} tileEl - The tile DOM element
   * @returns {void}
   */
  flipTile (tile, tileEl) {
    if (tile.matched || this.state.flipped.includes(tile)) return
    tileEl.textContent = tile.value
    this.state.flipped.push(tile)

    if (this.state.flipped.length === 2) {
      this.state.attempts++
      setTimeout(() => {
        this.checkMatch()
        this.renderBoard()
      }, 800)
    }
  }

  /**
   * Checks if the two flipped tiles match.
   * Updates matches state and clears flipped array.
   *
   * @returns {void}
   */
  checkMatch () {
    const [first, second] = this.state.flipped
    if (first.value === second.value) {
      first.matched = true
      second.matched = true
      this.state.matches++
    }
    this.state.flipped = []
  }
}

customElements.define('memory-app', MemoryApp)
