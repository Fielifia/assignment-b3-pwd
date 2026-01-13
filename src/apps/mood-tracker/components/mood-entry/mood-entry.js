const template = document.createElement('template')
template.innerHTML = `
<style>
.mood-entry-container {
    display: flex;
    flex-direction: column;
    font-size: clamp(.9rem, 1.5vw + .6rem, 1rem);
    gap: 1rem;
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
    gap: .5rem;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto clamp(.5rem, 1vw, 1rem);
}
.mood-buttons span {
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

.save-btn, select {
  border-radius: 10px;
  border: none;
  background: #8fb3cc;
  color: #000;
  transition: .2s ease;
  cursor: pointer;
  }
  
  .save-btn {
    padding: .5rem 1rem;
    text-transform: uppercase;
    width: fit-content;
    margin: 0 auto;
  }

  select {
    padding: .25rem .5rem;
  }

.save-btn:hover{
  background: #5f86a1;
  transform: scale(1.05);
  cursor: pointer;
}

button, span, select, input {
    cursor: pointer;
}
</style>

<div class="mood-entry-container">
<div class="select-mood">
<span>Select mood:
<button class="mood-info-btn" title="Click to see meanings">?
</button></span>
<div class="mood-legend">
</div>
<div class="mood-buttons"></div>
</div>
<label>Energy level:
<select class="energy-level">
<option value="" selected disabled>Select</option>
<option value="1">Terrible</option>
<option value="2">Low</option>
<option value="3">Okey</option>
<option value="4">Good</option>
<option value="5">Great</option>
</select>
</label>

<label>Sleep quality:
<select class="sleep-quality">
<option value="" selected disabled>Select</option>
<option value="1">Poor</option>
<option value="2">Okay</option>
<option value="3">Good</option>
</select>
</label>

<label>Sleep hours:
<input class="sleep-hours" type="number" value="8" min="0" max="24" placeholder="Hours slept">
</label>

<textarea placeholder="Notes..."></textarea>
<button class="save-btn">Save</button>
</div>
`
/**
 * Mood Tracker App.
 *
 * Web component that allows a user to select their mood and energy,
 * add notes, save them (to localStorage), and view history.
 * Inpired by Daylio.
 *
 * @augments HTMLElement
 */
export class MoodEntry extends HTMLElement {
  /**
   * Creates the component, initializes state, and attaches shadow DOM.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.moodValues = this.getAttribute('moods')
      ? this.getAttribute('moods').split(',')
      : [
          { emoji: '😁', label: 'Happy' },
          { emoji: '☺️', label: 'Content' },
          { emoji: '😐', label: 'Neutral' },
          { emoji: '😴', label: 'Tired' },
          { emoji: '😒', label: 'Bored' },
          { emoji: '😟', label: 'Anxious' },
          { emoji: '😢', label: 'Sad' },
          { emoji: '😡', label: 'Angry' }
        ]

    this.infoBtn = this.shadowRoot.querySelector('.mood-info-btn')
    this.moodLegend = this.shadowRoot.querySelector('.mood-legend')
    this.moodButtons = this.shadowRoot.querySelector('.mood-buttons')
    this.energyLevel = this.shadowRoot.querySelector('.energy-level')
    this.sleepHours = this.shadowRoot.querySelector('.sleep-hours')
    this.sleepQuality = this.shadowRoot.querySelector('.sleep-quality')
    this.textarea = this.shadowRoot.querySelector('textarea')
    this.saveBtn = this.shadowRoot.querySelector('.save-btn')
    this.selectedMood = null

    this.infoBtn.addEventListener('click', () => {
      this.moodLegend.innerHTML = `${this.moodValues.map(m => `${m.emoji} - ${m.label}`).join('<br/>')}`
      this.moodLegend.style.display = this.moodLegend.style.display === 'none' ? 'block' : 'none'
    })
  }

  /**
   * Called when the component is added to the DOM.
   * Initializes state, renders mood buttons, and history.
   */
  connectedCallback () {
    this.renderMoodButtons()
    this.saveBtn.addEventListener('click', () => {
      if (!this.selectedMood) {
        alert('Please select a mood!')
        return
      }
      this.dispatchEvent(
        new CustomEvent('entry-submit', {
          detail: {
            date: new Date().toISOString().slice(0, 10),
            mood: this.selectedMood,
            energy: this.energyLevel.value,
            sleep: {
              hours: this.sleepHours.value,
              quality: this.sleepQuality.value
            },
            notes: this.textarea.value
          },
          bubbles: true,
          composed: true
        })
      )
      this.resetForm()
    })
  }

  /**
   * Renders the mood buttons in the UI.
   * Creates one <span> per mood emoji and adds click events.
   */
  renderMoodButtons () {
    this.moodButtons.innerHTML = ''
    this.moodValues.forEach((m) => {
      const span = document.createElement('span')
      span.textContent = m.emoji
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
   * Resets the mood entry form to its initial state.
   */
  resetForm () {
    this.moodButtons
      .querySelectorAll('span')
      .forEach((s) => s.classList.remove('selected'))
    this.selectedMood = null
    this.energyLevel.value = ''
    this.sleepHours.value = ''
    this.sleepQuality.value = ''
    this.textarea.value = ''
  }
}

customElements.define('mood-entry', MoodEntry)
