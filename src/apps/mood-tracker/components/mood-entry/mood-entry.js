/**
 * @typedef {object} MoodEntryData
 * @property {string} id - Unique identifier
 * @property {string} date - Formatted date string
 * @property {string} time - Formatted time string
 * @property {[icon: string, label: string, color: string]} mood - Selected mood
 * @property {string}  energy - Energy level
 * @property {{hours: number, quality: string}} sleep - Sleep info
 * @property {[icon: string, label: string]} activities - Selected activities
 * @property {string} notes - Optional notes
 */

import { library, icon } from '@fortawesome/fontawesome-svg-core'

import { faTired, faFrown, faMeh, faSmile, faLaughBeam } from '@fortawesome/free-regular-svg-icons'

import {
  faBriefcase, faUsers, faRunning, faUserGroup, faUserGraduate, faHeart,
  faTicket, faChampagneGlasses, faGamepad, faPersonWalkingLuggage, faDumbbell,
  faCartShopping, faViruses, faBookOpen, faCouch, faSpa, faSkiing, faUmbrellaBeach,
  faPaintRoller, faAirFreshener, faBirthdayCake, faEdit
} from '@fortawesome/free-solid-svg-icons'
const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    display: none;
    background: #fff;
    padding: .5rem 1rem 1rem;
    box-sizing: border-box;
    margin: 0 auto;
}

/* Container */
.mood-entry-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto;
}
.mood-selection-container {
    display: flex;
    flex-direction: column;
    padding: 0;
    width: 100%;
}

/* Focus outline */
:focus-visible {
    outline: 2px solid #4d5f6a;
}

/* Mood selection */
.select-mood {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem auto;
}

.mood-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    margin: 3rem auto;
    gap: .5rem;
}
    
.mood-buttons span, .activity-buttons .icon-circle {
    display: flex;
    justify-content: center;
    align-content: center;
    transition: transform .1s ease;
}

.mood-buttons span {
    flex-direction: column;
    font-size: 3rem;
}
    
.mood-icon {
    width: 3rem;
    height: 3rem;
}

.activity-buttons .icon-circle {
    aspect-ratio: 1/1;
    border-radius: 50%;
    padding: .5rem;
    width: 1.2rem;
    height: 1.2rem;
    font-size: 1.2rem;
    background: #dde7ef;
    transition: background .2s ease;
}
    
.mood-buttons span p {
    font-size: .6rem;
    text-align: center;
    text-transform: lowercase;
}

.mood-buttons span:hover, .activity-buttons .icon-circle:hover, .selected-mood-top:hover {
    transform: scale(1.1);
}

.mood-buttons span:active, .activity-buttons .icon-circle:active {
    transform: scale(0.9);
}

.mood-buttons span.selected {
    transform: scale(1.3);
}

.selected-mood {
    margin-bottom: .5rem;
}

.mood-details {
  flex-direction: column;
  gap: 1rem;
  padding: 0 0 1rem;
}

.selected-mood-top {
  font-size: 2rem;
}

div.selected-mood-top > svg{
    width: 2rem;
    height: 2rem;
}


/* activities buttons */
.activity-buttons {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    max-width: 350px;
    justify-content: center;
    gap: .5rem;
}

.activity-buttons input[type="checkbox"] {
    display: none;
}

.activity-buttons label {
    display: flex;
    flex-direction: column;
    align-items: center;
}


.activity-buttons label p, .activity-buttons input[type="text"] {
  text-align: center;
  font-size: .6rem;
}

.activity-buttons .icon-circle:hover {
    background: #c8d9e6;
}

.activity-buttons label:has(input[type="checkbox"]:checked) .icon-circle {
    background: #8fb3cc;
    transform: scale(1.1);
}

.activity-buttons .icon-circle.active {
    background: #8fb3cc;
    transform: scale(1.1);
}
    
input[type="text"] {
    width: 100%;
    font-size: .6rem;
    padding-top: .6rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    border-image: linear-gradient(to right, transparent 0%, transparent 15%, #9b9ba7 15%,#9b9ba7 85%, transparent 85%, transparent 100%) 1;
    outline: none;
}

.activity-buttons label span i {
  font-size: 1.2rem;
  margin-bottom: .2rem;
}

/* Headings in select-activities */
span#heading {
    display: block;
    text-align: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    margin: 1rem auto;
    max-width: 200px;
}

/* Inputs */
input[type="date"] {
    font-family: inherit;
    border: none;
    border-bottom: 1px solid #000;
}

textarea {
    min-height: 50px;
    font-family: inherit;
    font-size: .7rem;
    border: none;
    background: #f2f6fa;
    border: 1px solid #dde7ef;
    padding: .5rem;
    border-radius: 6px;
}

input[type="number"] {
    background: #dde7ef;
    border: 1px solid #8fb3cc;
    border-radius: 10px;
    padding: .1rem .5rem;
    font-size: .9rem;
    color: #000;
    width: 3rem;
    transition: border .15s ease, box-shadow .15s ease, background .15s ease;
}

input[type="number"]:hover, select:hover {
    background: #8fb3cc;
}

input[type="number"]:focus-visible {
    outline: none;
    border-color: #4d5f6a;
    box-shadow: 0 0 0 2px rgba(77, 95, 106, 0.25);
}

input[type="checkbox"] {
    margin-right: .3rem;
    font-size: .7rem;
}

input[type="text"]:focus {
    border-bottom-color: #4d5f6a;
}

select {
    padding: .25rem .5rem;
}

.saved-feedback {
  width: 100%;
  text-align: center;
  font-weight: 600;
  color: #4d5f6a;
}
/* Buttons */
.buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-content: center;
}

.save-btn {
    padding: .5rem 1rem;
    text-transform: uppercase;
    margin: 0;
    background: #8fb3cc;
    border-radius: 10px;
    border: none;
    transition: .2s ease;
}

.go-back-btn, .view-history-btn, select {
    border-radius: 10px;
    border: none;
    background: #dde7ef;
    color: #000;
    transition: .2s ease;
}

.go-back-btn, .view-history-btn {
    padding: .5rem 1rem;
    text-transform: uppercase;
    width: fit-content;
    margin: 0;
}

.save-btn:hover, .go-back-btn:hover, .view-history-btn:hover {
    background: #5f86a1;
    transform: scale(1.05);
}

/* Global pointer cursor */
button, .mood-buttons span, select, input[type="number"], .icon-circle, .selected-mood-top {
    cursor: pointer;
}
</style>
<div class="mood-entry-container">
<div class="mood-selection-container">
<div class="select-mood">
<span id="heading">How are you?
</span>
<input type="date" id="date"></input>

<div class="mood-buttons"></div>
</div>
</div>

<div class="selected-mood-top" style="display:none; text-align:center;"></div>
<div class="mood-details" style="display: none;">

<div class="select-activities">
<span id="heading">What have you been up to?</span>
<div class="activity-buttons"></div>
</div>
<label>⚡Energy level:
<select class="energy-level">
<option value="" selected disabled>Select</option>
<option value="1">Terrible</option>
<option value="2">Low</option>
<option value="3">Okey</option>
<option value="4">Good</option>
<option value="5">Great</option>
</select>
</label>

<label>💤 Sleep quality:
<select class="sleep-quality">
<option value="" selected disabled>Select</option>
<option value="1">Poor</option>
<option value="2">Okay</option>
<option value="3">Good</option>
</select>
</label>

<label>⏱️ Sleep hours:
<input class="sleep-hours" type="number" value="8" min="0" max="24" placeholder="Hours slept">
</label>

<textarea placeholder="Notes..."></textarea>
</div>
<div class="saved-feedback" style="display:none"></div>
<div class="buttons">
<button class="save-btn" style="display:none;">Save</button>
<button class="go-back-btn">Go back</button>
<button class="view-history-btn">View History</button>
</div>
</div>
</div>
`

library.add(
  faTired, faFrown, faMeh, faSmile, faLaughBeam,
  faBriefcase, faUsers, faRunning, faUserGroup, faUserGraduate, faHeart,
  faTicket, faChampagneGlasses, faGamepad, faPersonWalkingLuggage, faDumbbell,
  faCartShopping, faViruses, faBookOpen, faCouch, faSpa, faSkiing, faUmbrellaBeach,
  faPaintRoller, faAirFreshener, faBirthdayCake, faEdit
)
/**
 * Mood Tracker Entry Component.
 *
 * Web component that allows a user to:
 * - select their mood
 * - rate energy level and sleep
 * - select multiple activities (checkboxes)
 * - add notes
 * - save entries (to localStorage)
 *
 * @augments HTMLElement
 */
export class MoodEntry extends HTMLElement {
  /**
   * Creates the component, attaches shadow DOM, initializes state and default moods/activities.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    /** @type {Array<{icon:string,label:string,color:string}>} */
    this.moodValues = [
      { icon: 'tired', label: 'Awful', color: '#9c4f4e', prefix: 'far' },
      { icon: 'frown', label: 'Bad', color: '#668aa6', prefix: 'far' },
      { icon: 'meh', label: 'Meh', color: '#e2b06d', prefix: 'far' },
      { icon: 'smile', label: 'Good', color: '#a4c0a4', prefix: 'far' },
      { icon: 'laugh-beam', label: 'Rad', color: '#7d997d', prefix: 'far' }
    ]

    /** @type {Array<{icon:string,label:string,prefix:string}>} */
    this.activityValues = [
      { icon: 'briefcase', label: 'Work', prefix: 'fas' },
      { icon: 'users', label: 'Family', prefix: 'fas' },
      { icon: 'running', label: 'Exercise', prefix: 'fas' },
      { icon: 'user-group', label: 'Friends', prefix: 'fas' },
      { icon: 'user-graduate', label: 'School', prefix: 'fas' },
      { icon: 'heart', label: 'Date', prefix: 'fas' },
      { icon: 'ticket', label: 'Movie', prefix: 'fas' },
      { icon: 'champagne-glasses', label: 'Party', prefix: 'fas' },
      { icon: 'gamepad', label: 'Gaming', prefix: 'fas' },
      { icon: 'person-walking-luggage', label: 'Travel', prefix: 'fas' },
      { icon: 'dumbbell', label: 'Workout', prefix: 'fas' },
      { icon: 'cart-shopping', label: 'Shopping', prefix: 'fas' },
      { icon: 'viruses', label: 'Sick', prefix: 'fas' },
      { icon: 'book-open', label: 'Reading', prefix: 'fas' },
      { icon: 'couch', label: 'Relax', prefix: 'fas' },
      { icon: 'spa', label: 'Spa', prefix: 'fas' },
      { icon: 'skiing', label: 'Skiing', prefix: 'fas' },
      { icon: 'umbrella-beach', label: 'Vacation', prefix: 'fas' },
      { icon: 'paint-roller', label: 'Redecorating', prefix: 'fas' },
      { icon: 'air-freshener', label: 'Clean', prefix: 'fas' },
      { icon: 'birthday-cake', label: 'Birthday', prefix: 'fas' }
    ]

    this.selectedMood = null
    this.selectedActivities = []

    this.entryContainer = this.shadowRoot.querySelector('.mood-entry-container')
    this.dateInput = this.shadowRoot.querySelector('#date')
    this.moodButtons = this.shadowRoot.querySelector('.mood-buttons')
    this.topContainer = this.shadowRoot.querySelector('.selected-mood-top')
    this.moodSelect = this.shadowRoot.querySelector('.select-mood')
    this.moodDetails = this.shadowRoot.querySelector('.mood-details')
    this.activityButtons = this.shadowRoot.querySelector('.activity-buttons')
    this.energyLevel = this.shadowRoot.querySelector('.energy-level')
    this.sleepHours = this.shadowRoot.querySelector('.sleep-hours')
    this.sleepQuality = this.shadowRoot.querySelector('.sleep-quality')
    this.textarea = this.shadowRoot.querySelector('textarea')
    this.saveBtn = this.shadowRoot.querySelector('.save-btn')
    this.goBackBtn = this.shadowRoot.querySelector('.go-back-btn')
    this.historyBtn = this.shadowRoot.querySelector('.view-history-btn')

    // Set default date to today
    this.dateInput.value = new Date().toISOString().split('T')[0]
  }

  /**
   * Lifecycle callback invoked when the component is added to the DOM.
   * Renders the current date, mood buttons, and sets up the save button.
   */
  connectedCallback () {
    this.renderMoodButtons()
    this.renderactivityCheckboxes()
    this.setupEventListeners()
  }

  /**
   * Sets upp event listeners for the component.
   *
   * Currently adds a click listener to the "go back" button that
   * dispatches a custom "navigate" event with page details.
   *
   * @returns {void}
   */
  setupEventListeners () {
    this.goBackBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'start' }, bubbles: true, composed: true }))
    })
    /**
     * Fired when the user clicks "View History".
     *
     * @event navigate
     * @type {CustomEvent<{page: string}>}
     * @property {object} detail - Contains the page to navigate to
     */
    this.historyBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'history', from: 'entry' }, bubbles: true, composed: true }))
    })

    this.saveBtn.addEventListener('click', () => {
      const savedFeedback = this.shadowRoot.querySelector('.saved-feedback')
      savedFeedback.style.display = 'block'
      savedFeedback.textContent = 'Entry saved!'

      const dateValue = this.dateInput.value
      const now = new Date()
      const date = new Date(dateValue + 'T00:00:00')
      const formattedDate = date.toLocaleDateString('en-US', {
      timeZone: 'Europe/Stockholm',
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
      const defaultDate = now.toLocaleDateString('en-US', { timeZone: 'Europe/Stockholm', weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
      const formattedTime = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', hour12: true })

      /** @type {MoodEntryData} */
      const data = {
        id: crypto.randomUUID(),
        date: formattedDate || defaultDate,
        time: formattedTime,
        mood: this.selectedMood,
        energy: this.energyLevel.value,
        sleep: {
          hours: this.sleepHours.value,
          quality: this.sleepQuality.selectedOptions[0]?.text || ''
        },
        activities: this.selectedActivities,
        notes: this.textarea.value
      }

      /**
       * Fired when the user saves a mood entry.
       *
       * @event entry-submit
       * @type {CustomEvent<MoodEntryData>}
       */
      this.dispatchEvent(new CustomEvent('entry-submit', { detail: data, bubbles: true, composed: true }))
      this.resetForm()
    })
  }

  /**
   * Renders the mood buttons in the UI.
   */
  renderMoodButtons () {
    this.moodButtons.innerHTML = ''
    this.moodValues.forEach((m) => {
      const moodButton = document.createElement('span')
      moodButton.tabIndex = 0
      moodButton.setAttribute('role', 'button')

      const moodIcon = document.createElement('div')
      moodIcon.innerHTML = icon({ prefix: m.prefix, iconName: m.icon }).html[0]
      moodIcon.classList.add('mood-icon')
      moodIcon.style.color = m.color
      moodButton.appendChild(moodIcon)

      moodButton.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          moodButton.click()
        }
      })

      const label = document.createElement('p')
      label.textContent = m.label
      label.style.fontSize = '.6rem'
      label.style.textAlign = 'center'
      moodButton.appendChild(label)

      moodButton.addEventListener('click', () => {
        if (this.moodSelect.style.display === 'none') return

        this.selectedMood = m

        this.moodButtons
          .querySelectorAll('span')
          .forEach((s) => s.classList.remove('selected'))
        moodButton.classList.add('selected')

        setTimeout(() => {
          this.showDetails()
          this.topContainer.innerHTML = icon({ prefix: m.prefix, iconName: m.icon }).html[0]
          this.topContainer.style.display = 'block'
          this.topContainer.style.color = m.color
          this.topContainer.addEventListener('click', () => {
            this.showMoodSelection()
          })
          this.topContainer.tabIndex = 0
          this.topContainer.setAttribute('role', 'button')
          this.topContainer.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              this.showMoodSelection()
            }
          })
        }, 250)
      })
      this.moodButtons.appendChild(moodButton)
    })
  }

  /**
   * Renders checkboxes for all activities and tracks selected ones.
   */
  renderactivityCheckboxes () {
    this.activityButtons.innerHTML = ''
    this.selectedActivities = []

    this.activityValues.forEach(a => {
      const label = document.createElement('label')

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.value = a.label

      const circle = document.createElement('div')
      circle.classList.add('icon-circle')
      circle.tabIndex = 0
      circle.setAttribute('role', 'checkbox')
      circle.innerHTML = icon({ prefix: a.prefix, iconName: a.icon }).html[0]

      const text = document.createElement('p')
      text.textContent = a.label

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          this.selectedActivities.push({ icon: a.icon, label: a.label })
        } else {
          this.selectedActivities = this.selectedActivities.filter(act => act.label !== a.label)
          circle.classList.remove('active')
        }
      })

      circle.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          checkbox.checked = !checkbox.checked
          checkbox.dispatchEvent(new Event('change'))
        }
      })

      label.append(checkbox, circle, text)
      this.activityButtons.appendChild(label)
    })

    for (let i = 0; i < 2; i++) {
      const label = document.createElement('label')

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.style.display = 'none'

      const circle = document.createElement('div')
      circle.classList.add('icon-circle')
      circle.innerHTML = icon({ prefix: 'fas', iconName: 'edit' }).html[0]
      circle.tabIndex = 0
      circle.setAttribute('role', 'checkbox')

      const input = document.createElement('input')
      input.type = 'text'
      input.placeholder = 'Custom'

      circle.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          checkbox.checked = !checkbox.checked
          checkbox.dispatchEvent(new Event('change'))
        }
      })

      input.addEventListener('focus', () => {
        input.placeholder = ''
      })
      input.addEventListener('blur', () => {
        const value = input.value.trim()
        if (!value) {
          checkbox.checked = false
          circle.classList.remove('active')
          this.selectedActivities = this.selectedActivities.filter(act => act.inputId !== input.dataset.id)
          return
        }
        if (checkbox.checked) {
          this.selectedActivities = this.selectedActivities.filter(act => act.inputId !== input.dataset.id)
          this.selectedActivities.push({
            icon: 'edit',
            prefix: 'fas',
            label: value,
            inputId: input.dataset.id
          })
          circle.classList.add('active')
        }
      })

      // Assign a unique id to track this input
      input.dataset.id = crypto.randomUUID()

      label.append(checkbox, circle, input)
      this.activityButtons.appendChild(label)
    }
  }

  /**
   * Shows the mood selection view and hides the details view.
   *
   * Resets the UI to allow the user to choose another mood.
   */
  showMoodSelection () {
    this.topContainer.style.display = 'none'
    this.moodSelect.style.display = 'flex'
    this.moodDetails.style.display = 'none'
    this.saveBtn.style.display = 'none'
    this.shadowRoot.querySelector('.selected-mood-top').style.display = 'none'
  }

  /**
   * Shows the mood details view and hides the mood selection.
   */
  showDetails () {
    this.topContainer.style.display = 'block'
    this.moodSelect.style.display = 'none'
    this.moodDetails.style.display = 'flex'
    this.saveBtn.style.display = 'block'
    this.shadowRoot.querySelector('.selected-mood-top').style.display = 'block'
  }

  /**
   * Resets the mood entry form to its initial state.
   */
  resetForm () {
    this.moodButtons
      .querySelectorAll('span')
      .forEach((s) => s.classList.remove('selected'))
    this.selectedMood = null
    this.energyLevel.value = ''
    this.sleepHours.value = '8'
    this.sleepQuality.value = ''
    this.textarea.value = ''
    this.selectedActivities = []

    this.activityButtons
      .querySelectorAll('input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false))
    this.activityButtons
      .querySelectorAll('input[type="text"]')
      .forEach((tf) => (tf.value = ''))
  }
}

customElements.define('mood-entry', MoodEntry)
