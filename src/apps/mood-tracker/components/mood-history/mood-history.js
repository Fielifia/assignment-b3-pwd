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

.entry-activities {
  grid-column: 2;
  grid-row: 3;
  display: flex;
}

.entry-details {
  grid-column: 1 / -1;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height .35s ease, opacity .25s ease;
  border-top: 1px solid #ccc;
  padding-top: 0;
}

.entry-details.open {
  max-height: 300px;
  opacity: 1;
  padding-top: .75rem;
}


.details-content {
  display: flex;
  flex-direction: column;
  gap: .3rem;
  position: relative;
}

.delete-btn {
  align-self: flex-end;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: .5rem;
}

.details-btn {
  grid-column: 3;
  grid-row: 2;
  justify-self: end;
  background: none;
  border: none;
  cursor: pointer;
  width: 1.2rem;
  height: 1.2rem;
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
    bottom: .6rem;
    right: .6rem;
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

      /* DATE */
      wrapper.innerHTML = `
        <span class="entry-date">${entry.date}</span>
      `

      /* ICON */
      const iconDiv = document.createElement('div')
      iconDiv.className = 'entry-icon'
      iconDiv.style.color = entry.mood.color

      const moodFa = moodIconMap[entry.mood.icon]
      if (moodFa) {
        iconDiv.appendChild(icon(moodFa).node[0])
      }

      /* MOOD + TIME */
      const moodTime = document.createElement('div')
      moodTime.className = 'entry-mood-time'
      moodTime.innerHTML = `
        <span class="mood" style="color:${entry.mood.color}">
          ${entry.mood.label}
        </span>
        <span class="time">${entry.time}</span>
      `

      if (entry.activities && entry.activities.length > 0) {
        const activitiesContainer = document.createElement('div')
        activitiesContainer.className = 'entry-activities'
        activitiesContainer.style.display = 'flex'
        activitiesContainer.style.flexWrap = 'wrap'
        activitiesContainer.style.gap = '0.5rem'
        activitiesContainer.style.marginTop = '0.3rem'

        entry.activities.forEach(act => {
          const label = act.label
          // Om det finns en icon-sträng använd den, annars fallback faEdit
          const actIcon = act.icon ? activityIconMap[label] || faEdit : faEdit

          const activityDiv = document.createElement('div')
          activityDiv.style.display = 'flex'
          activityDiv.style.flexDirection = 'column'
          activityDiv.style.alignItems = 'center'

          const iconCircle = document.createElement('div')
          iconCircle.className = 'icon-circle'
          iconCircle.style.width = '1.2rem'
          iconCircle.style.height = '1.2rem'
          iconCircle.style.color = entry.mood.color
          iconCircle.style.display = 'flex'
          iconCircle.style.justifyContent = 'center'
          iconCircle.style.alignItems = 'center'
          iconCircle.style.borderRadius = '50%'
          iconCircle.appendChild(icon(actIcon).node[0])

          const labelP = document.createElement('p')
          labelP.textContent = label
          labelP.style.fontSize = '.6rem'
          labelP.style.textAlign = 'center'
          labelP.style.margin = '0'

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

      wrapper.append(iconDiv, moodTime, detailsBtn, details)
      this.entryList.appendChild(wrapper)
    })
  }
}
customElements.define('mood-history', MoodHistory)
