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
  box-sizing: border-box;
    font-family: 'Atma', 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    display: none;
    flex-direction: column;
}
.memory-game {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  font-size: 1.2rem;
  padding: 1rem;
}

.memory-game.level-2 {
  grid-template-columns: repeat(2, 1fr);
}
.memory-game.level-4 {
  grid-template-columns: repeat(4, 1fr);
}
.memory-game.level-6 {
  grid-template-columns: repeat(6, 1fr);  
}

.status {
  background: grey;
  padding: .5rem;
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
  margin: 0 auto;
}

.tile:hover {
  background: linear-gradient(135deg, #7fa3bb, #d5e2ec);
  transform: translateY(-1px) scale(1.01);
}

.tile.matched {
  opacity: 0;
  pointer-events: none;
}
.tile.matched:hover {
  transform: none;
}

.controls {
  display: flex;
  width 100%;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
}

.message {
margin: 1rem auto;
}

button:not(.close-highscore), select {
  padding: .5rem 1rem;
  border-radius: 6px;
  border: none;
  background: #6c9edb;
  color: #fff;
  font-family: 'Atma', 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  text-transform: uppercase;
  font-weight: bold;
  transition: .2s ease;
  cursor: pointer;
}

button:not(.close-highscore):hover, select:hover, option{
  background: #5577aa;
  cursor: pointer;
}

.highscore-modal {
  position: absolute;
  top: 40px;
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

.close-highscore {
  position: absolute;
  top: 2.6rem;
  left: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 1.8rem;
  transition: .3s ease;
}

.close-highscore:hover {
  transform: scale(1.1)
}
</style>
<nickname-form></nickname-form>
<div class="memory-container">
<div class="status"></div>
<div class="message"></div>
<div class="memory-game"></div>
</div>
<div class="controls">
<div class="level-select">
<select id="level">
<option value="2">Level 1: 2x2</option>
<option value="4">Level 2: 4x4</option>
<option value="6">Level 3: 6x6</option>
</select>
</div>
<button class="restart-btn" style="display:none;">Restart</button>
<button class="show-highscores">High Scores</button>
</div>
</div>
<div class="highscore-modal">
<button class="close-highscore">↩</button>
<high-score></high-score>
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
      isBusy: false,
      level: 2
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
    this.nicknameForm.addEventListener('nickname-submitted', this.#onNicknameSubmitted)

    this.container = this.shadowRoot.querySelector('.memory-container')
    this.statusEl = this.shadowRoot.querySelector('.status')
    this.boardEl = this.shadowRoot.querySelector('.memory-game')
    this.messageEl = this.shadowRoot.querySelector('.message')

    this.levelSelect = this.shadowRoot.querySelector('#level')
    this.levelSelect.addEventListener('change', (e) => {
      this.state.level = parseInt(e.target.value, 10)
      this.boardEl.classList.add(`level-${this.state.level}`)

      if (this.highScoreComponent) {
        this.highScoreComponent.setLevel(this.state.level)
      }
      this.initGame()
    })

    this.highScoreComponent = this.shadowRoot.querySelector('high-score')
    this.highScoreBtn = this.shadowRoot.querySelector('.show-highscores')
    this.highscoreEl = this.shadowRoot.querySelector('.highscore-modal')
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
    if (nickname) this.nickname = nickname
    if (!this.nickname) return

    this.container.style.display = 'flex'

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
    const values = ['🍎', '🍌', '🍒', '🍇', '🍉', '🥝', '🍑', '🍍', '🥭', '🍋', '🍊', '🍐', '🍓', '🥥', '🍈', '🍋‍🟩', '🫐', '🍏']
    const needed = (this.state.level * this.state.level) / 2
    const tiles = values.slice(0, needed).concat(values.slice(0, needed))
    return this.shuffleArray(
      tiles.map((val, i) => ({ id: i + 1, value: val, matched: false }))
    )
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

      this.restartBtn = this.shadowRoot.querySelector('.restart-btn')
      this.restartBtn.style.display = 'block'
      this.restartBtn.addEventListener('click', () => this.initGame())

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
      if (this.highScoreComponent) this.highScoreComponent.addScore(this.nickname, this.state.time, this.state.level)
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
