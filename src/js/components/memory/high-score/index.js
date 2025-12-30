/**
 * The high-score web component.
 *
 * Displays a list of top scores and allows adding new scores.
 * Scores are stored in localStorage under the key 'highScores'.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 */
// Template for shadow DOM
const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
  display: flex;
  flex-direction: column;
  width: 100%;
}
#highscore-container {
  background: #5692ceff;
  padding: 2rem;
  border-radius: 2rem;
  color: #fff;
  margin: 1rem;
}
button#clear-btn {
  display: block;
  background: #476088;
  border-radius: 4rem;
  margin: 2rem auto 0;
  color: #fff;
  border: none;
  padding: .5rem 2rem;
  cursor: pointer;
  font-size: .8rem;
  transition: transform .2s ease;
}
button#clear-btn:hover {
  transform: scale(1.03);
}
h2, h3 {
  text-align: center;
  text-transform: uppercase;
}
h2 {
  margin: 1rem auto .5rem;
}
h3 {
  margin: 0 auto 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: .5rem 0;
}

th, td {
  padding: .5rem .2rem;
  text-align: left;
  border-bottom: 1px  solid #ffffff40;
}
tr.latest {
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #476088, #5692ce);
}
  td:hover {
  background: #47608880;
  }
.noscores {
  text-align: center;
  opacity: .8;
  padding: 1rem;
}
</style>
<div id="highscore-container">
<h2>High Scores</h2>
<h3>Top 5</h3>

<table>
<thead>
<tr>
<th>#</th>
<th>Name</th>
<th>Time (s)</th>
</tr>
</thead>
<tbody id="score-body"></tbody>
</table>

<button id="clear-btn">Clear Highscores</button>
</div>
`
/**
 * @class
 * @augments HTMLElement
 */
customElements.define('high-score',
  /**
   * High-score component.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the high-score component.
     * Initializes scores from localStorage and renders the list.
     *
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.tbody = this.shadowRoot.querySelector('#score-body')
      this.clearBtn = this.shadowRoot.querySelector('#clear-btn')
      this.clearBtn.addEventListener('click', () => this.clearScores())

      this.storageKey = 'quiz_highscores'
      this.scores = []

      this.loadScores()
      this.render()
    }

    /**
     * Loads the high scores from localStorage
     *
     * Attempts to parse the stored JSON under the key specified ny `this.storageKey`.
     * If the data is missing or invalid, an empty array is returned.
     * Updates the component's `scores` property with the loaded array.
     *
     * @returns {Array<object>} An array of score objects currently stored in localStorage.
     */
    loadScores () {
      let stored = []
      try {
        stored = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
        if (!Array.isArray(stored)) stored = []
      } catch {
        stored = []
      }
      this.scores = stored
      return stored
    }

    /**
     * Adds a new score to the list and updates localStorage.
     * Sorts the scores in ascending order before displaying.
     * Automatically re-renders the updated list.
     *
     * @param {string} name - Player's name.
     * @param {number} score - Time in seconds.
     */
    addScore (name, score) {
      let stored = this.loadScores()
      const timestamp = Date.now()

      const newScore = { name, score, timestamp }
      stored.push(newScore)

      stored.sort((a, b) => a.score - b.score)
      stored = stored.slice(0, 5)

      localStorage.setItem(this.storageKey, JSON.stringify(stored))
      this.scores = stored
      this.render()
    }

    /**
     * Clears high scores entirely.
     *
     * @public
     * @function
     */
    clearScores () {
      localStorage.removeItem(this.storageKey)
      this.scores = []
      this.render()
    }

    /**
     * Clears the "latest" marker from high score.
     *
     * @public
     * @returns {void}
     */
    clearLatestHighlight () {
      const rows = this.shadowRoot.querySelectorAll('tr.latest')
      rows.forEach(row => row.classList.remove('latest'))
    }

    /**
     * Renders the score list inside the component.
     *
     * @returns {void}
     */
    render () {
      this.tbody.innerHTML = ''

      if (!this.scores.length) {
        const tr = document.createElement('tr')
        const td = document.createElement('td')
        td.colSpan = 3
        td.className = 'noscores'
        td.textContent = 'No scores yet'
        tr.appendChild(td)
        this.tbody.appendChild(tr)
        return
      }

      const latestTimestamp = Math.max(...this.scores.map(s => s.timestamp || 0))

      this.scores.forEach((s, i) => {
        const tr = document.createElement('tr')
        if (s.timestamp === latestTimestamp) tr.classList.add('latest')
        tr.innerHTML = `<td>${i + 1}</td><td>${s.name}</td><td>${s.score}</td>`
        this.tbody.appendChild(tr)
      })
    }
  })
