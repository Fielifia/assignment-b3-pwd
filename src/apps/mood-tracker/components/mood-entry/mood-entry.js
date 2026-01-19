const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    display: none;
    background: #fff;
}

.mood-entry-container {
    display: flex;
    flex-direction: column;
    font-size: clamp(.9rem, 1.5vw + .6rem, 1rem);
    gap: 1.5rem;
    margin: 0;
    padding: 1rem;
    border-radius: 6px;
    min-width: 320px;
}

:focus-visible {
    outline: 2px solid #4d5f6a;
}

.select-mood {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
}

.mood-info-btn {
    background: #6f94ad;
    border: none;
    border-radius: 50%;
    width: 1.2rem;
    height: 1.2rem;
}

.mood-legend {
    display: none;
    position:absolute;
    top: 0;
    left: 100%;
    background: #dde7ef;
    padding: .5rem;
    margin: 0 .5rem;
    font-size: .8rem;
    border-radius: 6px;
    color: #000;
    z-index: 10;
    border: 1px solid #4d5f6a;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
    min-width: fit-content;
    max-width: 50vw;
}

.mood-buttons {
    display: flex;
    gap: .6rem;
    font-size: 1.6rem;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto clamp(.5rem, 1vw, 1rem);
}
.mood-buttons span {
    transition: transform .1s ease;
}

.mood-buttons span.selected {
    transform: scale(1.3);
}

.selected-mood {
    margin-bottom: .5rem;
}

textarea {
    min-height: 50px;
    font-family: inherit;
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

input[type="number"]:hover {
 background: #8fb3cc;
}

input[type="number"]:focus-visible {
  outline: none;
  border-color: #4d5f6a;
  box-shadow: 0 0 0 2px rgba(77, 95, 106, 0.25);
}

.feeling-buttons {
    display: grid;
    grid-template-columns: repeat(4, max-content);
    gap: .3rem;
    max-width: 100%;
    justify-content: start;
    }

.feeling-buttons input[type="checkbox"] {
    display: none;
}
    
.feeling-buttons label {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: .2rem;
    padding: .3rem .6rem;
    border-radius: 6px;
    background: #dde7ef;
    font-size: .7rem;
    user-select: none;
    width: fit-content;
    white-space: nowrap;
    transition: .2s ease;
}

.feeling-buttons label:hover {
    background: #c8d9e6;
}

.feeling-buttons label:has(input[type="checkbox"]:checked), .feeling-buttons label.active {
    background: #8fb3cc;
}

.mood-buttons span:active, .feeling-buttons label:active {
    transform: scale(0.9);
}

.feeling-buttons input[type="text"] {
    width: 100%;
    max-width: 3.5rem;
    font-size: .7rem;
    padding: 0;
    background: transparent;
    border: none;
    border-bottom: 1px solid #9b9ba7;
    outline: none;
}

.feeling-buttons input[type="text"]:focus {
    border-bottom-color: #4d5f6a;
}


input[type="checkbox"] {
    margin-right: .3rem;
    font-size: .7rem;
}
  
select {
  padding: .25rem .5rem;
}

.select-feelings span#heading {
  display: block;
  text-align: center;
  margin: .5rem auto;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-content: center;
}

.save-btn, select, .go-back-btn {
  border-radius: 10px;
  border: none;
  background: #8fb3cc;
  color: #000;
  transition: .2s ease;
  }

.save-btn, .go-back-btn {
    padding: .5rem 1rem;
    text-transform: uppercase;
    width: fit-content;
    margin: 0;
  }


.save-btn:hover, .go-back-btn:hover {
  background: #5f86a1;
  transform: scale(1.05);
}

button, span, select, input, .feeling-buttons label {
    cursor: pointer;
}
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<div class="mood-entry-container">
<date-time-display datetime="" format="datetime" show-seconds></date-time-display>
<span id="date-display"></span>
<div class="select-mood">
<span>Select mood:
</span>

<div class="mood-legend">
</div>

<div class="mood-buttons"></div>
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

<div class="select-feelings">
<span id="heading">I'm feeling:</span>
<div class="feeling-buttons"></div>
</div>

<textarea placeholder="Notes..."></textarea>
<div class="buttons">
<button class="go-back-btn">Go back</button>
<button class="save-btn">Save</button>
</div>
<button class="view-history-btn">View History</button>
</div>
`
/**
 * @typedef {object} MoodEntryData
 * @property {string} id - Unique identifier
 * @property {string} date - Formatted date string
 * @property {[icon: string, label: string, color: string]} mood - Selected mood
 * @property {string}  energy - Energy level
 * @property {{hours: number, quality: string}} sleep - Sleep info
 * @property {Array<string>} feelings - Selected feelings
 * @property {string} notes - Optional notes
 */

/**
 * Mood Tracker Entry Component.
 *
 * Web component that allows a user to:
 * - select their mood
 * - rate energy level and sleep
 * - select multiple feelings (checkboxes)
 * - add notes
 * - save entries (to localStorage)
 *
 * @augments HTMLElement
 */
export class MoodEntry extends HTMLElement {
  /**
   * Creates the component, attaches shadow DOM, initializes state and default moods/feelings.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    /** @type {Array<{icon: string, label:string, color:string}>} Available moods */
    this.moodValues = this.getAttribute('moods')
      ? this.getAttribute('moods').split(',')
      : [
          { icon: 'fa-angry', label: 'Angry', color: '#af6b6a' },
          { icon: 'fa-frown', label: 'Sad', color: '#95b4c8' },
          { icon: 'fa-grimace', label: 'Worried', color: '#fad6a2' },
          { icon: 'fa-smile-beam', label: 'Content', color: '#c9dcc9' },
          { icon: 'fa-laugh', label: 'Happy', color: '#a2b5a2' }
        ]

    /** @type {Array<string>} Available feelings for checkboxes */
    this.feelingValues = [
      'Loved',
      'Grateful',
      'Proud',
      'Productive',
      'Motivated',
      'Confident',
      'Relaxed',
      'Calm',
      'Satisfied',
      'Excited',
      'Anxious',
      'Nervous',
      'Annoyed',
      'Tired',
      'Upset',
      'Bored',
      'Stressed',
      'Hurt'
    ]

    this.selectedFeelings = []

    this.dateDisplay = this.shadowRoot.querySelector('#date-display')
    this.moodLegend = this.shadowRoot.querySelector('.mood-legend')
    this.moodButtons = this.shadowRoot.querySelector('.mood-buttons')
    this.energyLevel = this.shadowRoot.querySelector('.energy-level')
    this.sleepHours = this.shadowRoot.querySelector('.sleep-hours')
    this.sleepQuality = this.shadowRoot.querySelector('.sleep-quality')
    this.feelingButtons = this.shadowRoot.querySelector('.feeling-buttons')
    this.textarea = this.shadowRoot.querySelector('textarea')
    this.saveBtn = this.shadowRoot.querySelector('.save-btn')
    this.goBackBtn = this.shadowRoot.querySelector('.go-back-btn')
    this.historyBtn = this.shadowRoot.querySelector('.view-history-btn')
    this.selectedMood = null
  }

  /**
   * Lifecycle callback invoked when the component is added to the DOM.
   * Renders the current date, mood buttons, and sets up the save button.
   */
  connectedCallback () {
    this.renderMoodButtons()
    this.renderFeelingsCheckboxes()

    this.goBackBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { page: 'start' },
        bubbles: true,
        composed: true
      }))
    })

    this.saveBtn.addEventListener('click', () => {
      if (!this.selectedMood) {
        alert('Please select a mood!')
        return
      }

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

      const entryId = crypto.randomUUID()
      const formattedDate = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      this.dateDisplay.textContent = formattedDate

      /** @type {MoodEntryData} */
      const data = {
        id: entryId,
        date: formattedDate,
        mood: this.selectedMood,
        energy: this.energyLevel.value,
        sleep: {
          hours: this.sleepHours.value,
          quality: this.sleepQuality.selectedOptions[0]?.text || ''
        },
        feelings: this.selectedFeelings,
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
      const span = document.createElement('span')
      span.innerHTML = `<i class="far ${m.icon}" style="color: ${m.color};"></i>`
      span.title = m.label

      span.addEventListener('click', () => {
        this.selectedMood = m
        this.moodButtons
          .querySelectorAll('span')
          .forEach((s) => s.classList.remove('selected'))
        span.classList.add('selected')
      })
      this.moodButtons.appendChild(span)
    })
  }

  /**
   * Renders checkboxes for all feelings and tracks selected ones.
   */
  renderFeelingsCheckboxes () {
    this.feelingButtons.innerHTML = ''
    this.selectedFeelings = []

    this.feelingValues.forEach((feeling) => {
      const label = document.createElement('label')
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.value = feeling

      const text = document.createElement('span')
      text.textContent = feeling

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          this.selectedFeelings.push(feeling)
        } else {
          this.selectedFeelings = this.selectedFeelings.filter(
            (f) => f !== feeling
          )
        }
      })
      label.appendChild(checkbox)
      label.appendChild(text)
      this.feelingButtons.appendChild(label)
    })

    for (let i = 0; i < 2; i++) {
      const label = document.createElement('label')
      const input = document.createElement('input')
      input.type = 'text'
      input.placeholder = 'Custom'

      input.addEventListener('input', () => {
        this.selectedFeelings = this.selectedFeelings.filter(
          (f) => !f.startsWith(`custom${i}:`)
        )
        if (input.value.trim()) {
          this.selectedFeelings.push(`custom${i}:${input.value.trim()}`)
          label.classList.add('active')
        } else {
          label.classList.remove('active')
        }
      })
      label.appendChild(input)
      this.feelingButtons.appendChild(label)
    }
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
    this.selectedFeelings = []

    this.feelingButtons
      .querySelectorAll('input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false))
    this.feelingButtons
      .querySelectorAll('input[type="text"]')
      .forEach((tf) => (tf.value = ''))
  }
}

customElements.define('mood-entry', MoodEntry)
