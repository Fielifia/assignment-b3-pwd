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

.activity-buttons .icon-circle {
    aspect-ratio: 1/1;
    border-radius: 50%;
    padding: .5rem;
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

input:hover, select:hover {
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
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer">

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<div class="mood-entry-container">
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
<div class="buttons">
<button class="save-btn" style="display:none;">Save</button>
<button class="go-back-btn">Go back</button>
<button class="view-history-btn">View History</button>
</div>
</div>
`
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

    /** @type {Array<{icon: string, label:string, color:string}>} Available moods */
    this.moodValues = this.getAttribute('moods')
      ? this.getAttribute('moods').split(',')
      : [
          { icon: 'fa-tired', label: 'Awful', color: '#af6b6a' },
          { icon: 'fa-frown', label: 'Bad', color: '#95b4c8' },
          { icon: 'fa-meh', label: 'Meh', color: '#fad6a2' },
          { icon: 'fa-smile', label: 'Good', color: '#c9dcc9' },
          { icon: 'fa-laugh-beam', label: 'Rad', color: '#a2b5a2' }
        ]

    /** @type {Array<{icon: string, label:string}>} Available activities */
    this.activityValues = this.getAttribute('activities')
      ? this.getAttribute('activities').split(',')
      : [
          { icon: 'fa-solid fa-briefcase', label: 'Work' },
          { icon: 'fa-solid fa-users', label: 'Family' },
          { icon: 'fa-solid fa-running', label: 'Exercise' },
          { icon: 'fa-solid fa-user-group', label: 'Friends' },
          { icon: 'fa-solid fa-user-graduate', label: 'School' },
          { icon: 'fa-solid fa-heart', label: 'Date' },
          { icon: 'fa-solid fa-ticket', label: 'Movie' },
          { icon: 'fa-solid fa-champagne-glasses', label: 'Party' },
          { icon: 'fa-solid fa-gamepad', label: 'Gaming' },
          { icon: 'fa-solid fa-person-walking-luggage', label: 'Travel' },
          { icon: 'fa-solid fa-dumbbell', label: 'Workout' },
          { icon: 'fa-solid fa-cart-shopping', label: 'Shopping' },
          { icon: 'fa-solid fa-viruses', label: 'Sick' },
          { icon: 'fa-solid fa-book-open', label: 'Reading' },
          { icon: 'fa-solid fa-couch', label: 'Relax' },
          { icon: 'fa-solid fa-spa', label: 'Spa' },
          { icon: 'fa-solid fa-skiing', label: 'Skiing' },
          { icon: 'fa-solid fa-umbrella-beach', label: 'Vacation' },
          { icon: 'fa-solid fa-couch', label: 'Relax' },
          { icon: 'fa-solid fa-paint-roller', label: 'Redecorating' },
          { icon: 'fa-solid fa-air-freshener', label: 'Clean' },
          { icon: 'fa-solid fa-birthday-cake', label: 'Birthday' }
        ]

    this.selectedactivities = []

    this.dateInput = this.shadowRoot.querySelector('#date')
    this.moodSelect = this.shadowRoot.querySelector('.select-mood')
    this.moodButtons = this.shadowRoot.querySelector('.mood-buttons')
    this.topContainer = this.shadowRoot.querySelector('.selected-mood-top')
    this.moodDetails = this.shadowRoot.querySelector('.mood-details')
    this.energyLevel = this.shadowRoot.querySelector('.energy-level')
    this.sleepHours = this.shadowRoot.querySelector('.sleep-hours')
    this.sleepQuality = this.shadowRoot.querySelector('.sleep-quality')
    this.activityButtons = this.shadowRoot.querySelector('.activity-buttons')
    this.textarea = this.shadowRoot.querySelector('textarea')
    this.saveBtn = this.shadowRoot.querySelector('.save-btn')
    this.goBackBtn = this.shadowRoot.querySelector('.go-back-btn')
    this.historyBtn = this.shadowRoot.querySelector('.view-history-btn')
    this.selectedMood = null

    // Set default date to today
    const today = new Date().toISOString().split('T')[0]
    this.dateInput.value = today
  }

  /**
   * Lifecycle callback invoked when the component is added to the DOM.
   * Renders the current date, mood buttons, and sets up the save button.
   */
  connectedCallback () {
    this.renderMoodButtons()
    this.renderactivityCheckboxes()

    this.goBackBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { page: 'start' },
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
        detail: { page: 'history', from: 'entry' },
        bubbles: true,
        composed: true
      }))
    })

    this.saveBtn.addEventListener('click', () => {
      const entryId = crypto.randomUUID()
      const now = new Date()
      const formattedDate = now.toLocaleDateString('en-US', {
        timeZone: 'Europe/Stockholm',
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })

      const formattedTime = now.toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      this.dateDisplay.textContent = formattedDate

      /** @type {MoodEntryData} */
      const data = {
        id: entryId,
        date: formattedDate,
        time: formattedTime,
        mood: this.selectedMood,
        energy: this.energyLevel.value,
        sleep: {
          hours: this.sleepHours.value,
          quality: this.sleepQuality.selectedOptions[0]?.text || ''
        },
        activities: this.selectedactivities,
        notes: this.textarea.value
      }

      /**
       * Fired when the user saves a mood entry.
       *
       * @event entry-submit
       * @type {CustomEvent<MoodEntryData>}
       */
      this.dispatchEvent(
        new CustomEvent('entry-submit', {
          detail: data,
          bubbles: true,
          composed: true
        })
      )
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
      moodButton.innerHTML = `
      <i class="far ${m.icon}" style="color: ${m.color};"></i>
      <p class="mood-label">${m.label}</p>
      `
      moodButton.title = m.label

      moodButton.addEventListener('click', () => {
        if (this.moodSelect.style.display === 'none') return

        this.selectedMood = m

        this.moodButtons
          .querySelectorAll('span')
          .forEach((s) => s.classList.remove('selected'))
        moodButton.classList.add('selected')

        setTimeout(() => {
          this.showDetails()
          this.topContainer.innerHTML = `<i class="far ${m.icon}" style="color:${m.color}"></i>`
          this.topContainer.style.display = 'block'
          this.topContainer.addEventListener('click', () => {
            this.showMoodSelection()
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
    this.selectedactivities = []

    this.activityValues.forEach((activity) => {
      const label = document.createElement('label')

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.value = activity.label

      const circle = document.createElement('div')
      circle.classList.add('icon-circle')
      circle.innerHTML = `<i class="${activity.icon}"></i>`

      const text = document.createElement('p')
      text.textContent = activity.label

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          this.selectedactivities.push(activity.label)
        } else {
          this.selectedactivities = this.selectedactivities.filter(
            (f) => f !== activity.label
          )
        }
      })
      label.appendChild(checkbox)
      label.appendChild(circle)
      label.appendChild(text)
      this.activityButtons.appendChild(label)
    })

    for (let i = 0; i < 2; i++) {
      const label = document.createElement('label')

      const circle = document.createElement('div')
      circle.classList.add('icon-circle')
      circle.innerHTML = '<i class="fa-solid fa-edit"></i>'

      const text = document.createElement('input')
      text.type = 'text'
      text.placeholder = 'Custom'

      text.addEventListener('focus', () => {
        text.placeholder = ''
      })
      text.addEventListener('blur', () => {
        if (!text.value.trim()) text.placeholder = 'Custom'
      })

      circle.addEventListener('input', () => {
        text.textContent = text.value.trim() || 'Custom'

        this.selectedactivities = this.selectedactivities.filter(
          (f) => !f.startsWith(`custom${i}:`)
        )
        if (text.value.trim()) {
          this.selectedactivities.push(`custom${i}:${text.value.trim()}`)
          label.classList.add('active')
        } else {
          label.classList.remove('active')
        }
      })
      label.append(circle, text)
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
    this.selectedactivities = []

    this.activityButtons
      .querySelectorAll('input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false))
    this.activityButtons
      .querySelectorAll('input[type="text"]')
      .forEach((tf) => (tf.value = ''))
  }
}

customElements.define('mood-entry', MoodEntry)
