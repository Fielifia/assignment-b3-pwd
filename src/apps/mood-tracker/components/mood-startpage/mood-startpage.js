export const template = document.createElement('template')
template.innerHTML = `
<style>
.startpage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    text-align: center;
}

.greeting {
  font-size: clamp(1.5rem, 2vw, 2.5rem);
  color: #4d5f6a;
}

.buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-content: center;
}

button {
    border-radius: 10px;
    border: none;
    background: #8fb3cc;
    color: #000;
    transition: .2s ease;
    padding: .5rem 1rem;
    text-transform: uppercase;
    width: fit-content;
    margin: 0;
}

button:hover{
  background: #5f86a1;
  transform: scale(1.05);
  cursor: pointer;
}
</style>
<div class="startpage">
<div class="greeting"></div>
<div class="buttons">
<button class="create-entry-btn">Create new entry</button>
<button class="view-history-btn">View History</button>
</div>
</div>
`
/**
 * Start page for the Mood Tracker App.
 * Shows a greeting based on the time of day and buttons to navigate.
 */
export class MoodStartPage extends HTMLElement {
  /**
   * Creates the component, attaches Shadow DOM, and selects buttons and greeting element.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.greetingEl = this.shadowRoot.querySelector('.greeting')
    this.createBtn = this.shadowRoot.querySelector('.create-entry-btn')
    this.historyBtn = this.shadowRoot.querySelector('.view-history-btn')
  }

  /**
   * Lifecycle callback when component is added to the DOM.
   * Sets greeting and hooks up navigation events.
   */
  connectedCallback () {
    this.setGreeting()
    /**
     * Fired when the user clicks "Create new entry".
     *
     * @event navigate
     * @type {CustomEvent<{page: string}>}
     * @property {object} detail - Contains the page to navigate to
     */
    this.createBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { page: 'entry' },
        bubbles: true,
        composed: true
      }))
    })

    /**
     * Fired when the user clicks "View History".
     *
     * @event navigate
     * @type {CustomEvent<{page: string}>}
     * @property {object} detail - Contains the page to navigate to
     */
    this.historyBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { page: 'history' },
        bubbles: true,
        composed: true
      }))
    })
  }

  /**
   * Sets a greeting based on the current hour.
   */
  setGreeting () {
    const hour = new Date().getHours()
    let greeting = 'Hello'
    if (hour >= 5 && hour < 12) greeting = 'Good Morning'
    else if (hour >= 12 && hour < 18) greeting = 'Good Afternoon'
    else greeting = 'Good Evening'

    this.greetingEl.textContent = greeting + '!'
  }
}
customElements.define('mood-startpage', MoodStartPage)
