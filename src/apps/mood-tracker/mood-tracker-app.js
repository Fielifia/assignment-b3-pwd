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
import './components/mood-entry/mood-entry.js'
import './components/mood-history/mood-history.js'
import './components/mood-startpage/mood-startpage.js'
import { MoodManager } from './utils/mood-manager.js'
import { NavigationManager } from './utils/navigation-manager.js'
import { StateUpdater } from './utils/state-updater.js'
import { template } from './templates/mood-tracker.template.js'
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

    const startPage = this.shadowRoot.querySelector('mood-startpage')
    const entryComponent = this.shadowRoot.querySelector('mood-entry')
    const historyComponent = this.shadowRoot.querySelector('mood-history')

    NavigationManager.init(startPage, entryComponent, historyComponent)

    StateUpdater.updateHistory(historyComponent, this.state.entries)
    historyComponent.style.display = 'none'

    entryComponent.addEventListener('entry-submit', (e) => {
      this.state.entries = MoodManager.addEntry(e.detail)
      historyComponent.entries = this.state.entries
    })

    historyComponent.addEventListener('delete-entry', (e) => {
      console.log('DELETE EVENT RECIEVED', e.detail)
      this.state.entries = MoodManager.deleteEntry(e.detail)
      historyComponent.entries = this.state.entries
    })
  }

  /**
   * Loads saved state from localStorage.
   */
  loadState () {
    this.state.entries = MoodManager.getEntries()
  }
}

customElements.define('mood-tracker-app', MoodTrackerApp)
