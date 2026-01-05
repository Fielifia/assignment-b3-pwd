import './components/mood-entry.js'
/**
 * Mood Tracker Web Component
 *
 * Simple version inspired by 'Daylio'.
 * Select mood, energy and add notes every day,
 * save to localStorage and show history.
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
.mood-tracker-container {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    font-size: clamp(.9rem, 1.5vw + .6rem, 1rem);
    gap: .5rem;
    justify-content: center;
    align-items: center;
    margin-top: 0;
    padding: 0;
    border-radius: 6px;
    text-transform: uppercase;
}
:focus-visible {
  outline: 2px solid #4d5f6a;
}
.error-msg {
  color: #ff6b6b;
}

</style>

<div class="mood-tracker-container">
<h2>Mood Tracker</h2>
<mood-entry></mood-entry>
<mood-history></mood-history>
</div>
`

/**
 * Mood Tracker App
 *
 * Web component that allows a user to select their mood and energy,
 * add notes, save them (to localStorage), and view history.
 * Inpired by Daylio.
 *
 * @augments HTMLElement
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
    entryComponent.addEventListener('entry-submit', (e) => {
      this.state.entries.push(e.detail)
      localStorage.setItem('mood-tracker-entries',
        JSON.stringify(this.state.entries)
      )
      this.renderHistory()
    })
    this.renderHistory()
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
   * Renders the history of previous days.
   */
  // TODO: implement actual logic
  renderHistory () {

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
