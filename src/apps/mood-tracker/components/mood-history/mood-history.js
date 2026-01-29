import { library, icon } from '@fortawesome/fontawesome-svg-core'

import { faTired, faFrown, faMeh, faSmile, faLaughBeam, faTrashCan } from '@fortawesome/free-regular-svg-icons'

import {
  faBriefcase, faUsers, faRunning, faUserGroup, faUserGraduate, faHeart,
  faTicket, faChampagneGlasses, faGamepad, faPersonWalkingLuggage, faDumbbell,
  faCartShopping, faViruses, faBookOpen, faCouch, faSpa, faSkiing, faUmbrellaBeach,
  faPaintRoller, faAirFreshener, faBirthdayCake, faEdit, faChevronDown
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faTired, faFrown, faMeh, faSmile, faLaughBeam,
  faBriefcase, faUsers, faRunning, faUserGroup, faUserGraduate, faHeart,
  faTicket, faChampagneGlasses, faGamepad, faPersonWalkingLuggage, faDumbbell,
  faCartShopping, faViruses, faBookOpen, faCouch, faSpa, faSkiing, faUmbrellaBeach,
  faPaintRoller, faAirFreshener, faBirthdayCake, faEdit, faChevronDown, faTrashCan
)

const moodIconMap = {
  tired: faTired,
  frown: faFrown,
  meh: faMeh,
  smile: faSmile,
  'laugh-beam': faLaughBeam
}

const activityIconMap = {
  Work: faBriefcase,
  Family: faUsers,
  Exercise: faRunning,
  Friends: faUserGroup,
  School: faUserGraduate,
  Date: faHeart,
  Movie: faTicket,
  Party: faChampagneGlasses,
  Gaming: faGamepad,
  Travel: faPersonWalkingLuggage,
  Workout: faDumbbell,
  Shopping: faCartShopping,
  Sick: faViruses,
  Reading: faBookOpen,
  Relax: faCouch,
  Spa: faSpa,
  Skiing: faSkiing,
  Vacation: faUmbrellaBeach,
  Redecorating: faPaintRoller,
  Clean: faAirFreshener,
  Birthday: faBirthdayCake,
  Custom: faEdit
}

const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    display: none;
    background: #edf2f7;
    box-sizing: border-box;
    line-height: 1.5;
}

.history-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 250px;
    max-width: 400px;
    margin: 0 auto;
    font-size: .9rem;
    padding: .5rem;
    box-sizing: border-box;
}

h3 {
    text-align: center;
    text-transform: uppercase;
    margin: 1rem;;
}

.entries-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    max-height: 600px;
    overflow-y: auto;
}

.entry {
    display: grid;
    grid-template-columns: auto 1fr;
    position: relative;
    padding: 1rem 1rem 0;
    min-width: 0;
    border-radius: 8px;
    background: #edf2f7;
     border: 1px solid #cbd5e0; 
}

.entry-icon {
  grid-column: 1;
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
  display: flex;
  align-self: start;
}

.entry-header {
grid-column: 2;
  display: flex;
  text-transform: uppercase;
  font-size: .8rem;
  gap: 1rem;
}

.entry-time {
  color: #555;
}

.entry-heading {
  grid-column: 2;
  display: flex;
  gap: .5rem;
  align-items: baseline;
}

.entry-heading .mood-label {
font-size: 1.2rem;
padding: 0;
}

.entry-heading .entry-time {
  font-size: .8rem;
  color: #555;
  padding: 0;
}

.entry-activities {
  margin-top: 1rem;
  grid-column: 2;
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
}

.activity-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-circle {
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.activity-label {
  margin: 0;
  font-size: .6rem;
  text-align: center;
}

.entry-details {
  grid-column: 1 / -1;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height .35s ease, opacity .25s ease;
  border-top: 1px solid #ccc;
  margin-top: 1rem;
}

.entry-details.open {
  max-height: 300px;
  opacity: 1;
  padding: .5rem;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: .3rem;
  position: relative;
}

.details-btn {
  position: absolute;
  top: 1rem;
  right: .5rem;
  background: none;
  border: none;
  cursor: pointer;
  width: 1.6rem;
  height: 1.6rem;
  transition: .2s ease;
}

.details-btn.open {
  transform: rotate(180deg);
}

.details-btn:hover {
  color: #5f86a1;
  transform: scale(1.1);
}

.delete-btn {
    position: absolute;
    top: 0;
    right: 0;
    justify-self: end;
    background: none;
    border: none;
    cursor: pointer;
    width: 1.6rem;
    height: 1.6rem;
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
   * Renders all mood history entries into the history list.
   *
   * This method clears the current list and rebuilds it based on
   * {@link MoodHistory#entries}. For each entry it:
   *
   * - Creates a grid-based entry container.
   * - Renders the mood icon using Font Awesome based on `entry.mood.icon`.
   * - Displays mood label, color and time.
   * - Adds a toggle button that expands/collapses the details section
   * with a smooth CSS transition and rotates the chevron icon.
   * - Renders additional details such as energy, sleep and notes.
   * - Adds a delete button that dispatches a `delete-entry` event
   * with the entry id when clicked.
   *
   * The method does not return a value and performs direct DOM manipulation.
   *
   * @returns {void}
   */
  render () {
    this.entryList.innerHTML = ''

    this.entries.forEach(entry => {
      const wrapper = document.createElement('div')
      wrapper.className = 'entry'
      wrapper.style.borderColor = entry.mood.color

      /**
       * Convertts a hex color to an RGB string.
       *
       * @param {string} hex - Hex color string.
       * @returns {string} - RGB color string.
       */
      const hexToRgb = (hex) => {
        const bigint = parseInt(hex.replace('#', ''), 16)
        const r = (bigint >> 16) & 255
        const g = (bigint >> 8) & 255
        const b = bigint & 255
        return `${r},${g},${b}`
      }

      const rgb = hexToRgb(entry.mood.color)
      wrapper.style.boxShadow = `0 4px 12px rgba(${rgb}, 0.15)`

      const header = document.createElement('div')
      header.className = 'entry-header'

      const date = document.createElement('div')
      date.className = 'entry-date'
      date.textContent = entry.date

      const iconDiv = document.createElement('div')
      iconDiv.className = 'entry-icon'
      iconDiv.style.color = entry.mood.color

      const moodFa = moodIconMap[entry.mood.icon]
      if (moodFa) {
        iconDiv.appendChild(icon(moodFa).node[0])
      }

      const entryContent = document.createElement('div')
      entryContent.className = 'entry-heading'

      const moodLabel = document.createElement('div')
      moodLabel.className = 'mood-label'
      moodLabel.textContent = entry.mood.label
      moodLabel.style.color = entry.mood.color

      const time = document.createElement('div')
      time.className = 'entry-time'
      time.textContent = entry.time

      header.appendChild(date)
      entryContent.appendChild(moodLabel)
      entryContent.appendChild(time)
      wrapper.appendChild(iconDiv)
      wrapper.appendChild(header)
      wrapper.appendChild(entryContent)

      if (entry.activities && entry.activities.length > 0) {
        const activitiesContainer = document.createElement('div')
        activitiesContainer.className = 'entry-activities'

        entry.activities.forEach(act => {
          const label = act.label
          const actIcon = act.icon ? activityIconMap[label] || faEdit : faEdit

          const activityDiv = document.createElement('div')
          activityDiv.classList.add('activity-item')

          const iconCircle = document.createElement('div')
          iconCircle.className = 'icon-circle'
          iconCircle.style.color = entry.mood.color
          iconCircle.appendChild(icon(actIcon).node[0])

          const labelP = document.createElement('p')
          labelP.classList.add('activity-label')
          labelP.textContent = label

          activityDiv.append(iconCircle, labelP)
          activitiesContainer.appendChild(activityDiv)
        })
        wrapper.appendChild(activitiesContainer)
      }

      /* CHEVRON */
      const detailsBtn = document.createElement('button')
      detailsBtn.className = 'details-btn'
      detailsBtn.appendChild(icon(faChevronDown).node[0])

      /* DETAILS */
      const details = document.createElement('div')
      details.className = 'entry-details'
      details.innerHTML = `
        <div class="details-content">
          <span><strong>Energy:</strong> ${entry.energy}</span>
          <span><strong>Sleep:</strong> ${entry.sleep?.hours || '-'}h (${entry.sleep?.quality || '-'})</span>
          <span><strong>Notes:</strong> ${entry.notes || '-'}</span>
        </div>
      `

      const deleteBtn = document.createElement('button')
      deleteBtn.className = 'delete-btn'
      deleteBtn.appendChild(icon(faTrashCan).node[0])

      details.querySelector('.details-content').appendChild(deleteBtn)

      detailsBtn.addEventListener('click', () => {
        details.classList.toggle('open')
        detailsBtn.classList.toggle('open')
      })

      deleteBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('delete-entry', {
          detail: entry.id,
          bubbles: true,
          composed: true
        }))
      })

      wrapper.append(detailsBtn, details)
      this.entryList.appendChild(wrapper)
    })
  }
}
customElements.define('mood-history', MoodHistory)
