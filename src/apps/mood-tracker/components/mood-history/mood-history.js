const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    display: none;
    background: #edf2f7;
    box-sizing: border-box;
}

.history-container {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    width: 100%;
    font-size: .9rem;
    padding: 1rem;
    box-sizing: border-box;
}

.entries-list {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    max-height: 400px;
}

h3 {
  margin: 0 auto;
}

.entry {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto auto;
    position: relative;
    gap: 1rem;
    padding: 1rem;
    min-width: 0;
    border-radius: 8px;
    background: #edf2f7;
    align-items: center;
    box-shadow: 2px 6px 12px rgba(0,0,0,0.1);
}

.entry-date {
  grid-column: 1 / -1;
  grid-row: 1;
  text-align: center;
  text-transform: uppercase;
  font-size: .8rem;
}

.entry-icon {
  grid-column: 1;
  grid-row: 2 / 4;
  display: flex;
  font-size: 3rem;
  align-items: center;
  justify-content: center;
}

.entry-mood-time {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: 1rem;
}

.entry-mood-time .mood {
  font-size: 1.6rem;
  text-transform: uppercase;
}

.entry-mood-time .time {
  font-size: .8rem;
}

.entry-feelings {
  grid-column: 2;
  grid-row: 3;
  display: flex;
}

.entry-details {
  background: #ccc;
  grid-row: 5;
}

.details-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  background: none;
  border: none;
  transition: .2s ease;
}

.details-btn:hover {
  background: none;
  color: blue;
}

.delete-btn {
    grid-column: span 2;
    justify-self: end;
    background: none;
    border: none;
    cursor: pointer;
    font-size: .9rem;
}
button {
  padding: .5rem 1rem;
  margin: 1rem;
  border-radius: 6px;
  border: none;
  background: #8fb3cc;
  color: #000;
  text-transform: uppercase;
  font-weight: 500;
  transition: .2s ease;
  cursor: pointer;
  width: fit-content;
}

button:hover {
  background: #5f86a1;
  transform: scale(1.05);
  cursor: pointer;
}
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<div class="history-container">
<h3>History</h3>
<div class="entries-list"></div>
<button class="go-back-btn">Go back</button>
</div>
`
/**
 * @typedef {object} MoodHistoryEntry
 * @property {string} id - Unique identifier
 * @property {string} date - Formatted date string
 * @property {string} time - Formatted time string
 * @property {[icon: string, label: string, color: string]} mood - Selected mood
 * @property {string}  energy - Energy level
 * @property {{hours: number, quality: string}} sleep - Sleep info
 * @property {Array<string>} feelings - Selected feelings
 * @property {string} notes - Optional notes
 */

/**
 * Custom element to display mood history entries.
 *
 * @class
 * @augments HTMLElement
 */
export class MoodHistory extends HTMLElement {
  /**
   * Initializes the MoodHistory component and attaches the shadow DOM.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.entryList = this.shadowRoot.querySelector('.entries-list')
    this.goBackBtn = this.shadowRoot.querySelector('.go-back-btn')
  }

  /**
   * Lifecycle callback when element is added to the DOM.
   * Ensures properties set before definition are upgraded.
   */
  connectedCallback () {
    this.#upgradeProperty('entries')

    this.goBackBtn.addEventListener('click', () => {
      const target = this.previousPage || 'start'
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { page: target },
        bubbles: true,
        composed: true
      }))
    })
  }

  /**
   * Upgrades a property that might have been set before the element was defined.
   *
   * @private
   * @param {string} prop - Property name to upgrade.
   * @returns {void}
   */
  #upgradeProperty (prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop]
      delete this[prop]
      this[prop] = value
    }
  }

  /**
   * Sets the mood entries to be displayed.
   *
   * @param {Array<MoodHistoryEntry>} entries - Array of mood entry objects.
   * @returns {void}
   */
  set entries (entries = []) {
    this._entries = entries
    this.render(entries)
  }

  /**
   * Gets the current mood entries.
   *
   * @returns {Array<MoodHistoryEntry>} Array of mood entry objects.
   */
  get entries () {
    return this._entries || []
  }

  /**
   * Renders the mood entries in the history container.
   *
   * @param {Array<MoodHistoryEntry>} entries - Array of mood entry objects.
   * @returns {void}
   */
  render (entries) {
    this.entryList.innerHTML = ''
    entries.forEach(entry => {
      const div = document.createElement('div')
      div.classList.add('entry')
      div.innerHTML = `
                <span class="entry-date">${entry.date}</span>
                <div class="entry-icon">
                <i class="far ${entry.mood.icon}" style="color: ${entry.mood.color};"></i>
                </div>

                <div class="entry-mood-time">
                <span class="mood" style="color: ${entry.mood.color};">${entry.mood?.label}</span>
                <span class="entry-time">${entry.time}</span>
                </div>

                <div class="entry-feelings">
                <span>Feelings: ${entry.feelings.join(', ')}</span>
                </div>
                
                <button class="details-btn">v</button>
                <div class="entry-details" style="display:none;">
                <span>Energy level: ${entry.energy}</span>
                <span>Hours slept: ${entry.sleep?.hours}h</span>
                <span>Sleep quality: ${entry.sleep?.quality}</span>
                <span>Notes: ${entry.notes || '-'}</span>
                <button class="delete-btn">🗑️</button>
                </div>`

      div.querySelector('.details-btn').addEventListener('click', () => {
        div.querySelector('.entry-details').style.display = 'flex'
      })

      /**
       * Fired when a mood entry is deleted.
       *
       * @event delete-entry
       * @type {CustomEvent<string>}
       * @property {string} detail - Date of the entry to delete.
       */
      div.querySelector('.delete-btn').addEventListener('click', () => {
        console.log('DELETE CLICKED!')
        this.dispatchEvent(new CustomEvent('delete-entry', {
          detail: entry.id,
          bubbles: true,
          composed: true
        }))
      })
      this.entryList.appendChild(div)
    })
  }
}
customElements.define('mood-history', MoodHistory)
