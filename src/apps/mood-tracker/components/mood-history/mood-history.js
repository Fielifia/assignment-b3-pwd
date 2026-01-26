import { library, icon } from '@fortawesome/fontawesome-svg-core'

import { faTired, faFrown, faMeh, faSmile, faLaughBeam } from '@fortawesome/free-regular-svg-icons'

import {
  faBriefcase, faUsers, faRunning, faUserGroup, faUserGraduate, faHeart,
  faTicket, faChampagneGlasses, faGamepad, faPersonWalkingLuggage, faDumbbell,
  faCartShopping, faViruses, faBookOpen, faCouch, faSpa, faSkiing, faUmbrellaBeach,
  faPaintRoller, faAirFreshener, faBirthdayCake, faEdit
  , faChevronDown, faTrash
} from '@fortawesome/free-solid-svg-icons'

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
    max-height: 600px;
    overflow-y: auto;
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
  width: 3rem;
  height: 3rem;
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
  display: none;
  flex-direction: column;
  gap .3rem;
  padding-top: .5rem;
  border-top: 1px solid #ccc;
  grid-column: 1 / -1;
}

.details-btn {
  grid-column: 3;
  grid-row: 2;
  justify-self: end;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: .2s ease;
}

.details-btn:hover {
  color: #5f86a1;
  transform: scale(1.1);
}

.delete-btn {
    justify-self: end;
    background: none;
    border: none;
    cursor: pointer;
    font-size: .9rem;
}
button.go-back-btn {
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

button.bo-back-btn:hover {
  background: #5f86a1;
  transform: scale(1.05);
  cursor: pointer;
}
</style>
<div class="history-container">
<h3>History</h3>
<div class="entries-list"></div>
<button class="go-back-btn">Go back</button>
</div>
`
library.add(
  faTired, faFrown, faMeh, faSmile, faLaughBeam,
  faBriefcase, faUsers, faRunning, faUserGroup, faUserGraduate, faHeart,
  faTicket, faChampagneGlasses, faGamepad, faPersonWalkingLuggage, faDumbbell,
  faCartShopping, faViruses, faBookOpen, faCouch, faSpa, faSkiing, faUmbrellaBeach,
  faPaintRoller, faAirFreshener, faBirthdayCake, faEdit, faChevronDown, faTrash
)
/**
 * @typedef {object} MoodHistoryEntry
 * @property {string} id - Unique identifier
 * @property {string} date - Formatted date string
 * @property {string} time - Formatted time string
 * @property {{icon: string, label: string, color: string, prefix: string}} mood - Selected mood
 * @property {string}  energy - Energy level
 * @property {{hours: number, quality: string}} sleep - Sleep info
 * @property {Array<string>} activities - Selected activities
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
   * Generates a HTML template string for a mood tracker entry.
   *
   * The template includes date, mood icon and label, time, activities,
   * detailed info (energy, sleep, notes), and action buttons.
   *
   * @param {object} entry - The mood tracker entry object.
   * @param {string} [entry.date] - The date of the entry.
   * @param {string} [entry.time] - The time of the entry.
   * @param {object} [entry.mood] - Mood information.
   * @param {string} [entry.mood.icon] - Emoji or icon representing the mood.
   * @param {string} [entry.mood.label] - Text label for the mood.
   * @param {string} [entry.mood.color] - Color associated with the mood.
   * @param {string[]} [entry.activities] - List of activities for the entry.
   * @param {number} [entry.energy] - Energy level for the entry.
   * @param {object} [entry.sleep] - Sleep information.
   * @param {number} [entry.sleep.hours] - Hours slept.
   * @param {string} [entry.sleep.quality] - Quality of sleep.
   * @param {string} [entry.notes] - Additional notes for the entry.
   * @returns {string} HTML string representing the entry.
   */
  #entryTemplate (entry) {
    const detailsChevron = icon(faChevronDown).html[0]
    const trashIcon = icon(faTrash).html[0]

    return `
      <span class="entry-date">${entry.date || '-'}</span>
      <div class="entry-icon" style="color: ${entry.mood?.color || '#000'}">${entry.mood?.icon || '?'}</div>
      <div class="entry-mood-time">
        <span class="mood" style="color: ${entry.mood?.color || '#000'}">${entry.mood?.label || '-'}</span>
        <span class="entry-time">${entry.time || '-'}</span>
      </div>
      <div class="entry-activity">
        <span>Activities: ${entry.activities?.join(', ') || '-'}</span>
      </div>
      <button class="details-btn">${detailsChevron}</button>
      <div class="entry-details">
        <span>Energy level: ${entry.energy || '-'}</span>
        <span>Hours slept: ${entry.sleep?.hours || '-'}h</span>
        <span>Sleep quality: ${entry.sleep?.quality || '-'}</span>
        <span>Notes: ${entry.notes || '-'}</span>
        <button class="delete-btn">${trashIcon}</button>
      </div>
    `
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
      div.innerHTML = this.#entryTemplate(entry)

      const detailsBtn = div.querySelector('.details-btn')
      const detailsDiv = div.querySelector('.entry-details')
      detailsBtn.addEventListener('click', () => {
        detailsDiv.style.display = detailsDiv.style.display === 'flex' ? 'none' : 'flex'
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
