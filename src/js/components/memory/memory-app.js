/**
 * Memory Game Web Component.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 1.0.0
 */
import './nickname-form/index.js'
import './high-score/index.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
.memory-container {
position: relative;
width: 100%;
height: 60vh;
}
.memory-game {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1rem;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    font-size: 1.2rem;
}

.status {
    font-weight: bold;
    margin-bottom: 1rem;
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

.tile.matched {
opacity: 0.7;
pointer-events: none;
}
.tile.matched:hover {
transform: none;
}
.highscore-modal {
position: absolute;
top: 60px;
left: 0;
width: 100%;
height: 100%;
background: #fff;
justify-content: center;
align-items: flex-start;
display: none;
overflow-y: auto;
box-sizing: border-box;
}

.highscore-modal high-score {
max-height: 100%;
width: 100%;
}

.close-highscore {
position: absolute;
top: .5rem;
right: .5rem;
}
</style>
<div class="memory-container">
<nickname-form></nickname-form>
<div class="status"></div>
<div class="memory-game"></div>
<div class="controls">
<button class="restart-btn">Restart</button>
<button class="show-highscores">High Scores</button>
<div class="message"></div>
</div>
</div>
<div class="highscore-modal">
<button class="close-highscore">Close</button>
<high-score></high-score>
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
   * Handles nickname submission from the nickname-form.
   *
   * @param {CustomEvent} event - Contains the nickname inside event.detail.
   * @returns {void}
   */
  #onNicknameSubmitted = (event) => {
    this.nickname = event.detail
    this.nicknameForm.style.display = 'none'
    this.initGame()
  }

  /**
   * Creates an instance of MemoryApp
   * Initializes shadow DOM and the initial game state.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.state = {
      board: [],
      flipped: [],
      matches: 0,
      attempts: 0,
      time: 0,
      timerId: null,
      isBusy: false
    }
  }

  /**
   * Called when the component is added to the DOM.
   * Initilizes the game.
   *
   * @returns {void}
   */
  connectedCallback () {
    this.nicknameForm = this.shadowRoot.querySelector('nickname-form')

    this.statusEl = this.shadowRoot.querySelector('.status')
    this.boardEl = this.shadowRoot.querySelector('.memory-game')
    this.messageEl = this.shadowRoot.querySelector('.message')
    this.restartBtn = this.shadowRoot.querySelector('.restart-btn')

    this.highScoreBtn = this.shadowRoot.querySelector('.show-highscores')
    this.highscoreEl = this.shadowRoot.querySelector('.highscore-modal')

    this.nicknameForm.addEventListener('nickname-submitted', this.#onNicknameSubmitted)
    this.restartBtn.addEventListener('click', () => this.initGame())
    this.highScoreBtn.addEventListener('click', () => {
      this.highscoreEl.style.display = 'flex'
    })
    this.shadowRoot.querySelector('.close-highscore').addEventListener('click', () => {
      this.highscoreEl.style.display = 'none'
    })
    if (this.highScoreEl) {
      this.boardEl.style.display = 'none'
    }
  }

  /**
   * Called when removed from the DOM.
   * Cleans up listeners to prevent memory leaks.
   *
   * @returns {void}
   */
  disconnectedCallback () {
    this.nicknameForm?.removeEventListener('nickname-submitted', this.#onNicknameSubmitted)
  }

  /**
   * Initializes the memory game after nickname submission.
   * Creates the board, shuffle tiles, and resets game state.
   *
   * @param {string} nickname - The player's nickname
   * @returns {void}
   */
  initGame (nickname) {
    if (!nickname) return

    this.state.board = this.createTiles()
    this.state.flipped = []
    this.state.matches = 0
    this.state.attempts = 0
    this.state.time = 0

    if (this.state.timerId) clearInterval(this.state.timerId)

    this.state.timerId = setInterval(() => {
      this.state.time++
      this.updateStatus()
    }, 1000)

    this.messageEl.textContent = ''
    this.render()
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
  render () {
    this.boardEl.innerHTML = ''
    // Tiles
    this.state.board.forEach(tile => {
      const tileEl = document.createElement('div')
      tileEl.classList.add('tile')

      if (tile.matched) {
        tileEl.classList.add('matched')
      }

      tileEl.textContent = tile.matched || this.state.flipped.includes(tile) ? tile.value : ''
      tileEl.addEventListener('click', () => this.flipTile(tile, tileEl))
      this.boardEl.appendChild(tileEl)
    })
    this.updateStatus()
  }

  /**
   * Updates the game status display.
   *
   * Shows current time, number of matches, and attempts.
   *
   * @returns {void}
   */
  updateStatus () {
    this.statusEl.textContent = `Time: ${this.state.time}s | Matches: ${this.state.matches} | Attempts: ${this.state.attempts}`
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
    if (this.state.isBusy) return
    if (tile.matched || this.state.flipped.includes(tile)) return
    tileEl.textContent = tile.value
    this.state.flipped.push(tile)

    if (this.state.flipped.length === 2) {
      this.state.isBusy = true
      this.state.attempts++
      setTimeout(() => {
        this.checkMatch()
        this.state.isBusy = false
        this.render()
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
    if (!first || !second) return

    if (first.value === second.value) {
      first.matched = true
      second.matched = true
      this.state.matches++
    }
    this.state.flipped = []

    if (this.state.matches === this.state.board.length / 2) {
      clearInterval(this.state.timerId)
      this.state.timerId = null
      this.showMessage(`🎉 ${this.nickname}, you won in ${this.state.time}s with ${this.state.attempts} attempt!`)
      if (this.highScoreEl) this.highScoreEl.addScore(this.nickname, this.state.time)
    }
  }

  /**
   * Displays a message to the player.
   *
   * Used to show game-related feedback such as win messages.
   *
   * @param {string} msg - The message text to display
   * @returns {void}
   */
  showMessage (msg) {
    this.messageEl.textContent = msg
  }
}

customElements.define('memory-app', MemoryApp)
