const template = document.createElement('template')
template.innerHTML = `
<style>
.history-container {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    width: 100%;
    max-width: 400px;
    font-size: .9rem;
    padding: 1rem;
    border-top: 2pz solid #4d5f6a;
}

.entry {
    display: flex;
    flex-direction: column;
    padding: .5rem;
    border-radius: 6px;
    background: #dde7ef;
}

.entry span {

}

.delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #ff4d4d;
    font-size: .9rem;
}
</style>

<div class="history-container>
<h3>History</h3>
<div class="entrier-list"></div>
</div>
`
/**
 * Custom element to display mood history.
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
    this.container = this.shadowRoot.querySelector('history-container')
  }

  /**
   * Gets the mood entries to be displayed in the history.
   *
   * @param {Array<object>} entries - Array of mood entry objects.
   */
  getEntries (entries) {
    this.render(entries)
  }

  /**
   * Renders the mood entries in the history container.
   *
   * @param {Array<object>} entries - Array of mood entry objects.
   * @returns {void}
   */
  render (entries) {
    this.container.querySelectorAll('.entry').forEach(e => e.remove())
    entries.ForEach(entry => {
      const div = document.createElement('div')
      div.classList.add('entry')
      div.innerHTML = `
                <span>${entry.date}</span>
                <span>${entry.mood.emoji} - ${entry.mood.label}</span>
                <span>Energy: ${entry.energy}</span>
                <span>Slep: ${entry.sleep.hours}h / ${entry.sleep.quality}</span>
                <span>Notes: ${entry.notes} || '-' </span>
                <button class="delete-btn>🗑️</button>`

      div.querySelector('.delete-btn').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('delete-entry', {
          detail: entry.date,
          bubbles: true,
          composed: true
        }))
      })
      this.container.appendChild(div)
    })

    customElements.define('mood-history', MoodHistory)
  }
}
