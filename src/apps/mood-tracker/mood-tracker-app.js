/**
 * Mood Tracker Web Component
 *
 * Simple version inspired by 'Daylio'.
 * Select mood, energy and add notes every day,
 * save to localStorage and show history.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @augments HTMLElement
 */
import './modules/mood-entry.js'
import { MoodManager } from './modules/mood-manager.js'
import { template } from './mood-tracker.template.js'
/**
 * Mood Tracker App
 *
 * Web component that allows a user to select their mood and energy,
 * add notes, save them (to localStorage), and view history.
 * Inpired by Daylio.
 */

/**
 *
 */
export class MoodTrackerApp extends HTMLElement {
  /**
   * Creates the component, initializes state, and attaches shadow DOM.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.state = { entries: [] }
  }

  /**
   * Called when the component is added to the DOM.
   * Initializes state, renders mood buttons, and history.
   */
  connectedCallback () {
    this.loadState()

    const entryComponent = this.shadowRoot.querySelector('mood-entry')
    const historyComponent = this.shadowRoot.querySelector('mood-history')

    entryComponent.addEventListener('entry-submit', (e) => {
      this.state.entries = MoodManager.addEntry(e.detail)
      historyComponent.enries = this.state.entries
    })

    historyComponent.addEventListener('delete-entry', (e) => {
      this.state.entries = MoodManager.deleteEntry(e.detail)
      historyComponent.entries = this.state.entries
    })

    historyComponent.entries = this.state.entries
  }

  /**
   * Loads saved state from localStorage.
   */
  loadState () {
    try {
      this.state.entries =
        JSON.parse(localStorage.getItem('mood-tracker-entries')) || []
    } catch {
      this.state.entries = []
    }
  }

  /**
   * Returns today's date in YYY-MM-DD format.
   *
   * @returns {string} Today's date
   */
  getToday () {
    return new Date().toISOString().slice(0, 10)
  }
}

customElements.define('mood-tracker-app', MoodTrackerApp)
