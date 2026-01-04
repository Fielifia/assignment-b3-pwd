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
:focus {
  outline: 2px solid #4d5f6a;
}
.error-msg {
  color: #ff6b6b;
}

.mood-buttons {
    display: flex;
    gap: .5rem;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    margin: clamp(.5rem, 1vw, 1rem) auto;
}
.mood-buttons span {
    cursor: pointer;
    transition: transform .1s ease;
}
.mood-buttons span:hover {
    transform: scale(1.2);
}

.mood-buttons span.selected {
    transform: scale(2);
}

.selected-mood {
    margin-bottom: .5rem;
}
</style>

<div class="mood-tracker-container">
<h2>Mood Tracker</h2>
<p class="selected-mood">Select mood:</p>

<div class="mood-buttons"></div>
<div class="energy-buttons"></div>
<div class="notes">
<textarea></textarea>
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

    this.state = {
      today: '',
      moods: [],
      energy: [],
      notes: ''
    }

    this.moodValues = this.getAttribute('moods')
      ? this.getAttribute('moods').split(',')
      : [
          '😁',
          '☺️',
          '🫤',
          '😒',
          '😡',
          '😢',
          '😭',
          '🥱',
          '😞',
          '😖',
          '😰',
          '😉',
          '😜'
        ]

    this.moodButtons = this.shadowRoot.querySelector('.mood-buttons')
    this.selectedEl = this.shadowRoot.querySelector('.selected-mood')
    this.textarea = this.shadowRoot.querySelector('textarea')
    this.selectedMood = null
  }

  /**
   * Called when the component is added to the DOM.
   * Initializes state, renders mood buttons, and history.
   */
  // TODO: add energy buttons, calendar and notes
  connectedCallback () {
    this.loadState()
    this.renderMoodButtons()
    this.renderHistory()
    this.handleMoodSelection()
  }

  /**
   * Loads saved state from localStorage.
   */
  // TODO: implement actual logic
  loadState () {}

  /**
   * Saves current state to localStorage.
   */
  // TODO: implement actual logic
  saveState () {}

  /**
   * Renders the mood buttons in the UI.
   * Creates one <span> per mood emoji and adds click events.
   */
  renderMoodButtons () {
    this.moodButtons.innerHTML = ''
    this.moodValues.forEach((m) => {
      const span = document.createElement('span')
      span.textContent = m

      span.addEventListener('click', () => {
        this.selectedMood = m

        this.moodButtons
          .querySelectorAll('span')
          .forEach((s) => s.classList.remove('selected'))

        span.classList.add('selected')

        this.moodButtons.querySelectorAll('span').forEach((s) => {
          this.dispatchEvent(
            new CustomEvent('mood-selected', {
              detail: { mood: m },
              bubbles: true,
              composed: true
            })
          )
        })
      })
      this.moodButtons.appendChild(span)
    })
  }

  /**
   * Handles additional logic when a mood is selected.
   */
  // TODO: implement if needed
  handleMoodSelection () {}

  /**
   * Renders the history of previous days.
   */
  // TODO: implement actual logic
  renderHistory () {}

  /**
   * Returns today's date in YYY-MM-DD format.
   *
   * @returns {string} Today's date
   */
  getToday () {
    this.today = Date.now().toISOString().slice(0, 10)
    return this.today
  }
}

customElements.define('mood-tracker-app', MoodTrackerApp)
