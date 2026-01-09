/**
 * Memory Game Web Component.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 1.0.0
 */
import '../../components/high-score.js'
import '../../components/nickname-form.js'
import { createInitialState, initGameState, resetState } from './components/game-state.js'
import { startTimer, stopTimer } from './components/timer.js'
import { renderBoard } from './components/board-renderer.js'
import { flipTile, checkMatch } from './components/game-logic.js'
import { VIEWS, viewConfig } from './components/views.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
* {
  font-family: 'Montserrat', Arial, Helvetica, sans-serif;
  box-sizing: border-box;
}
  :host {
    color: #000;
    display: block;
    max-height: 100vh;
    overflow-y: auto;
  }
.container {
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;
    background: #8fb3cc2a;
}
.memory-container {
  display: none;
  flex-direction: column;
  flex: 1;
}
.memory-game {
  display: none;
  flex: 1;
  gap: .6rem;
  padding: 1rem;
  min-height: 0;
  overflow: auto;
  padding: 1rem;
}

.memory-game.level-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(40px, 1fr));
}
.memory-game.level-4 {
  display: grid;
  grid-template-columns: repeat(4, minmax(40px, 1fr));
}
.memory-game.level-6 {
  display: grid;
  grid-template-columns: repeat(6, minmax(40px, 1fr));  
}

.status {
  display: none;
  background: linear-gradient(145deg, #3f5f73, #5f86a1);
  padding: .5rem;
}

.tile {
  width: 100%;
  flex: 1 1 auto;
  perspective: 1000px;
  min-height: 30px;
  aspect-ratio: 1/1;
  border-radius: 6px;
}
  
  .tile-inner {
  position: relative;
  width: 95%;
  height: 95%;
  inset:0;
  transform-style: preserve-3d;
  opacity: 1;
  transform: scale(1);
  transition: transform 1s, opacity 3s;
}
  
.tile.flip .tile-inner {
  transform: rotateY(180deg);
}

.tile.flip {
transform: scale(1.05);
box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45),
}

.front, .back {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  border-radius: 6px;
}

.front {
  background: linear-gradient(135deg, #5f86a1, #8fb3cc);
  transform: rotateY(180deg);
}

.back {
  background: linear-gradient(145deg, #5f86a1, #3f5f73);
  }

:focus-visible {
  outline: 2px solid #4d5f6a;
}

.tile.matched {
  pointer-events: none;
  transform: scale(0.8);
  opacity: 0;
  transition: .6s ease;
  }
    
.tile.matched .tile-inner {
  opacity: 1;
  transform: rotateY(180deg);
}

.message {
  text-align: center;
  margin: 0 auto 1rem;
  max-width: 300px;
  }
  
.controls {
  display: flex;
  max-width: 100%;
  margin: 1rem 1rem;
  padding: 0;
  gap: 1rem;
  align-content: end;
}

button, select {
  padding: .5rem 1rem;
  border-radius: 6px;
  border: none;
  background: #8fb3cc;
  text-transform: uppercase;
  font-weight: 500;
  transition: .2s ease;
  cursor: pointer;
}


button:hover, select:hover, option{
  background: #5f86a1;
  transform: scale(1.05);
  cursor: pointer;
}

.restart-btn {
margin-left: auto;
margin-right: auto;
}

.highscore-modal {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: flex-start;
  display: none;
  box-sizing: border-box;
}

.message {
  display: none;
  font-size: 1.4rem;
  overflow-wrap: break-word;
  padding: 1rem;
}
</style>
<div class="container">
<nickname-form label-text="Enter a nickname:"></nickname-form>
<div class="memory-container">
<div class="status"></div>
<div class="message"></div>
<div class="memory-game"></div>
</div>

<div class="controls">
<button class="go-back-btn" style="display:none;">Go back</button>
<button class="restart-btn" style="display:none;">Restart</button>
<div class="level-select">
<select id="level">
<option value="" selected disabled>Select level</option>
<option value="2">Level 1: 2x2</option>
<option value="4">Level 2: 4x4</option>
<option value="6">Level 3: 6x6</option>
</select>
</div>
<button class="show-highscores" style="display:none;">High Scores</button>
</div>
<div class="highscore-modal">
<high-score></high-score>
</div>
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
    const nickname =
      typeof event.detail === 'string' ? event.detail : event.detail.nickname
    this.nickname = nickname

    const level = parseInt(this.levelSelect.value, 10)
    if (!level) {
      this.showMessage('Select a level!', '1rem')
      return
    }
    this.state.level = level
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
    /// //SAFE
    this.state = createInitialState()

    this.currentView = null

    this.prevView = null
  }

  /**
   * Called when the component is added to the DOM.
   * Initilizes the game.
   *
   * @returns {void}
   */
  connectedCallback () {
    this.container = this.shadowRoot.querySelector('.memory-container')
    this.boardEl = this.shadowRoot.querySelector('.memory-game')
    this.statusEl = this.shadowRoot.querySelector('.status')
    this.messageEl = this.shadowRoot.querySelector('.message')
    this.controls = this.shadowRoot.querySelector('.controls')
    this.nicknameForm = this.shadowRoot.querySelector('nickname-form')
    this.levelSelect = this.shadowRoot.querySelector('#level')
    this.goBackBtn = this.shadowRoot.querySelector('.go-back-btn')
    this.restartBtn = this.shadowRoot.querySelector('.restart-btn')
    this.highScoreBtn = this.shadowRoot.querySelector('.show-highscores')
    this.highscoreEl = this.shadowRoot.querySelector('.highscore-modal')
    this.highScoreComponent = this.shadowRoot.querySelector('high-score')

    this.uiElements = {
      container: this.container,
      board: this.boardEl,
      status: this.statusEl,
      message: this.messageEl,
      controls: this.controls,
      nicknameForm: this.nicknameForm,
      highScore: this.highscoreEl
    }

    this.nicknameForm.addEventListener(
      'nickname-submitted',
      this.#onNicknameSubmitted
    )

    this.levelSelect.addEventListener('change', (e) => {
      this.state.level = parseInt(e.target.value, 10)
      this.boardEl.classList.add(`level-${this.state.level}`)
      this.setView(VIEWS.START)
      if (this.highScoreComponent) {
        this.highScoreComponent.setLevel(this.state.level)
      }
    })

    this.goBackBtn.addEventListener('click', () => {
      console.log('Go back clicked')
      this.backToStart()
    })

    this.highScoreComponent.addEventListener('highscore-back', () => {
      switch (this.prevView) {
        case VIEWS.IN_GAME:
          this.setView(VIEWS.IN_GAME)
          startTimer()
          break
        case VIEWS.GAME_END:
        case VIEWS.START:
        default:
          this.setView(VIEWS.START)
          break
      }
      this.prevView = null
    })

    this.highScoreBtn.addEventListener('click', () => {
      if (!this.state.gameOver && this.state.timerId) {
        this.prevView = VIEWS.IN_GAME
        stopTimer()
      } else if (this.state.gameOver) {
        this.prevView = VIEWS.GAME_END
      } else {
        this.prevView = VIEWS.START
      }
      this.setView(VIEWS.HIGHSCORES)
    })

    this.restartBtn.addEventListener('click', () => this.initGame())
  }

  /**
   * Called when removed from the DOM.
   * Cleans up listeners to prevent memory leaks.
   *
   * @returns {void}
   */
  disconnectedCallback () {
    this.nicknameForm?.removeEventListener(
      'nickname-submitted',
      this.#onNicknameSubmitted
    )
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

    this.setView(VIEWS.IN_GAME)

    initGameState(this.state, this.state.level)

    this.updateStatus()

    requestAnimationFrame(() => {
      startTimer(this.state, () => this.updateStatus())
    })

    this.boardEl.className = 'memory-game'
    this.boardEl.classList.add(`level-${this.state.level}`)
    this.messageEl.textContent = ''

    renderBoard(this.boardEl, this.state.board, (tile, tileEl) => flipTile(this.state, tile, tileEl, (state) => checkMatch(state, () => this.handleGameOver())))
    this.restartBtn.textContent = 'Restart'
  }

  /**
   * Updates the game status display.
   *
   * Shows current time, number of matches, and attempts.
   *
   * @returns {void}
   */
  updateStatus () {
    if (!this.statusEl || this.currentView !== VIEWS.IN_GAME) return

    const { time, matches, attempts } = this.state
    this.statusEl.textContent = `Time: ${time}s | Matches: ${matches} | Attempts: ${attempts}`
  }

  /**
   * Resets the game to initial start state.
   * Shows nickname form and level selection.
   *
   * @returns {void}
   */
  backToStart () {
    resetState(this.state)
    stopTimer(this.state)
    this.resetUI()
  }

  /**
   * Resets the UI to the initial start state.
   * Shows nickname form and level selection.
   * Hides the game board, status, message, and irrelevant buttons.
   *
   * @returns {void}
   */
  resetUI () {
    this.setView(VIEWS.START)
    this.boardEl.innerHTML = ''
    this.messageEl.textContent = ''
  }

  /**
   * Handles the end of the game.
   * Stops the timer, hides the board and status,
   * shows a completion message and updates high scores.
   *
   * @returns {void}
   */
  handleGameOver () {
    this.state.gameOver = true
    stopTimer(this.state)
    this.prevView = VIEWS.GAME_END
    this.setView(VIEWS.GAME_END)
    this.showMessage(
      `<strong>${this.nickname}</strong>, you finished in ${this.state.time} seconds with ${this.state.attempts} attempts! 🎉`
    )
    if (this.highScoreComponent) {
      this.highScoreComponent.addScore(
        this.nickname,
        this.state.time,
        this.state.level
      )
    }
    this.restartBtn.textContent = 'Play again!'
  }

  /**
   * Shows a message to the player.
   *
   * @param {string} text - The message text to display.
   * @param {string} size - Optional font size (default '1.4rem').
   */
  showMessage (text, size = '1.4rem') {
    this.container.style.display = 'flex'
    this.messageEl.style.display = 'block'
    this.messageEl.innerHTML = text
    this.messageEl.style.fontSize = size
  }

  /**
   * Toggles visibility of control buttons.
   *
   * @param {object} options - Show/hide specific controls.
   * @param {boolean} [options.levelSelect] - Show/hide the level select dropdown
   * @param {boolean} [options.restart] - Show/hide the restart button
   * @param {boolean} [options.goBack] - Show/hide the go back button
   * @param {boolean} [options.highScore] - Show/hide the high score button
   * @returns {void}
   */
  toggleControls (options = {}) {
    const mapping = {
      levelSelect: this.levelSelect,
      restart: this.restartBtn,
      goBack: this.goBackBtn,
      highScore: this.highScoreBtn
    }

    Object.entries(mapping).forEach(([key, el]) => {
      if (options[key] !== undefined) {
        el.style.display = options[key] ? 'block' : 'none'
      }
    })
  }

  /**
   * Sets the current UI view based on the view name.
   *
   * Updates the visibility of container, board, status, message,
   * nickname form, controls, and highscore modal according to
   * the predefined views configuration.
   *
   * @param {string} viewName - One of VIEWS.START, VIEWS.IN_GAME, VIEWS.GAME_END, VIEWS.HIGHSCORES
   * @returns {void}
   */
  setView (viewName) {
    const view = viewConfig[viewName]
    if (!view) return

    this.currentView = viewName

    Object.entries(this.uiElements).forEach(([key, el]) => {
      if (view[key] !== undefined) el.style.display = view[key]
    })

    if (view.toggleControls) this.toggleControls(view.toggleControls)
  }
}

customElements.define('memory-app', MemoryApp)
