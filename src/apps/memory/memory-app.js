/**
 * Memory Game Web Component.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 1.0.0
 */
import './components/high-score/high-score.js'
import '../../components/nickname-form/nickname-form.js'
import { template } from './templates/memory-app.template.js'
import { createInitialState, initGameState, resetState } from './services/game-state.js'
import { startTimer, stopTimer } from './services/timer.js'
import { renderBoard } from './ui/board-renderer.js'
import { flipTile, checkMatch } from './logic/game-logic.js'
import { VIEWS, viewConfig } from './ui/views.js'
import { playWinnerSound } from './utils/sounds.js'

/**
 * Custom element <memory-app> representing a Memory Game.
 *
 * @class
 * @augments HTMLElement
 */
class MemoryApp extends HTMLElement {
  /** @type {AbortController|null} Controller for removing event listeners on disconnect */
  #abortController
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

    this.state = createInitialState()
    this.currentView = null
    this.prevView = null
  }

  /**
   * Lifecycle callback when the component is added to the DOM.
   * Initilizes the game.
   *
   * @returns {void}
   */
  connectedCallback () {
    this.#abortController = new AbortController()
    const signal = this.#abortController.signal

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
      this.#onNicknameSubmitted, { signal }
    )

    this.levelSelect.addEventListener('change', (e) => {
      this.state.level = parseInt(e.target.value, 10)
      this.boardEl.classList.add(`level-${this.state.level}`)
      this.setView(VIEWS.START)
      if (this.highScoreComponent) {
        this.highScoreComponent.setLevel(this.state.level)
      }
    }, { signal })

    this.goBackBtn.addEventListener('click', () => {
      console.log('Go back clicked')
      this.backToStart()
    }, { signal })
    this.restartBtn.addEventListener('click', () => this.initGame(), { signal })
    this.highScoreBtn.addEventListener('click', () => {
      if (!this.state.gameOver && this.state.timerId) {
        this.prevView = VIEWS.IN_GAME
        stopTimer(this.state)
      } else if (this.state.gameOver) {
        this.prevView = VIEWS.GAME_END
      } else {
        this.prevView = VIEWS.START
      }
      this.setView(VIEWS.HIGHSCORES)
    }, { signal })

    this.highScoreComponent.addEventListener('highscore-back', () => {
      switch (this.prevView) {
        case VIEWS.IN_GAME:
          this.setView(VIEWS.IN_GAME)
          startTimer(this.state, () => this.updateStatus())
          break
        case VIEWS.GAME_END:
        case VIEWS.START:
        default:
          this.setView(VIEWS.START)
          break
      }
      this.prevView = null
    }, { signal })
  }

  /**
   * Called when removed from the DOM.
   * Cleans up listeners to prevent memory leaks.
   *
   * @returns {void}
   */
  disconnectedCallback () {
    this.#abortController.abort()
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
    playWinnerSound()
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
