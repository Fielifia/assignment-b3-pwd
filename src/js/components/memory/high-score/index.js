/**
 * The high-score web component.
 *
 * Displays a list of top scores and allows adding new scores.
 * Scores are stored in localStorage per level under the key format:
 * `memory_highscores_level{level}`.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 */
// Template for shadow DOM
const template = document.createElement('template')
template.innerHTML = `
<style>
* {
    font-family: 'Montserrat', Arial, Helvetica, sans-serif;
    }
#highscore-container {
  background: #dde7ef;
  padding: 1rem;
  border-radius: 2rem;
  color: #000;
  margin: 1rem;
}
  
.buttons {
  display: flex;
  width 100%;
  gap: 1rem;
  padding: 1rem;
}
  
button {
  padding: .5rem 1rem;
  border-radius: 6px;
  border: none;
  background: #6f94ad;
  color: #000;
  text-transform: uppercase;
  font-weight: 500;
  transition: .2s ease;
  cursor: pointer;
}

button:hover{
  background: #4d5f6a;
  cursor: pointer;
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
  border-bottom: 1px  solid #4d5f6a;
}
tr.latest {
  font-weight: bold;
  color: #000;
  background: linear-gradient(90deg, #dde7ef78, #6f94ad78);
  }
  tbody tr:hover {
    background: linear-gradient(90deg, #6f94ad78, #dde7ef78);
  }
.noscores {
  text-align: center;
  opacity: .8;
  padding: 1rem;
}
</style>
<div id="highscore-container">
<h2>High Scores</h2>
<h3 id="top">Top 5 - </h3>

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
<div class="buttons">
<button class="close-highscore">Go back</button>
<button id="clear-btn">Clear Highscores</button>
</div>
</div>
`
/**
 * @class
 * @augments HTMLElement
 */
customElements.define('high-score',
  /**
   * Displays a top 5 high score list per game level.
   * Scores are stored in localStogare using separate keys per level
   * in the format `memory_highscore_level{level}`
   *
   * The component exposes a public API for:
   * - setting the active level
   * - adding new scores
   * - clearing scores per level
   *
   * @author Sofia Andersson <sa226jf@student.lnu.se>
   * @augments HTMLElement
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the high-score component.
     *
     * Attaches a shadow DOM, initializes internal state,
     * and sets up event listeners for user interactions.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.tbody = this.shadowRoot.querySelector('#score-body')
      this.clearBtn = this.shadowRoot.querySelector('#clear-btn')
      this.clearBtn.addEventListener('click', () => {
        if (this.currentLevel !== null) this.clearScores(this.currentLevel)
      })

      this.scores = []
      this.currentLevel = null

      this.levelMap = {
        2: 1,
        4: 2,
        6: 3
      }

      this.closeHighScoreBtn = this.shadowRoot.querySelector('.close-highscore')
      this.closeHighScoreBtn.addEventListener('click', () => {
        this.closeHighScore()
      })
    }

    /**
     * Sets the active level for the high score list.
     *
     * Loads scores for the given level from localStorage
     * and re-renders the component.
     *
     * @param {number} level - The selected game level.
     * @returns {void}
     */
    setLevel (level) {
      if (!level) return
      this.loadScores(level)
      this.render()
    }

    /**
     * Loads the high scores for a specific level from localStorage.
     *
     * Updates the component's state amd returns the parsed score list.
     * If no valid data exists, an empty array is used.
     *
     * @param {number} level - The game level to load scores for.
     * @returns {Array<object>} An array of stored high score entries.
     */
    loadScores (level) {
      if (!level) return []
      this.currentLevel = level
      this.storageKey = `memory_highscores_level${level}`
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
     * Adds a new high score entry for a specific level.
     *
     * The list i sorted by best (lowest) time and limited to the top 5 scores.
     * Automatically persist the result to localStorage an re-renders the list.
     *
     * @param {string} name - Player's nickname.
     * @param {number} score - Completion time in seconds.
     * @param {number} level - The level the score was achieved on.
     * @returns {void}
     */
    addScore (name, score, level) {
      if (!level) return
      this.currentLevel = level
      this.storageKey = `memory_highscores_level${level}`
      let stored = this.loadScores(level)

      const timestamp = Date.now()
      stored.push({ name, score, timestamp, level })

      stored.sort((a, b) => a.score - b.score)
      stored = stored.slice(0, 5)

      localStorage.setItem(this.storageKey, JSON.stringify(stored))
      this.scores = stored
      this.render()
    }

    /**
     * Clears all stored high score for a specific level.
     *
     * Removes the corresponding localStorage entry
     * and resets the rendered llist.
     *
     * @param {number} level - The level to clear scores for.
     * @returns {void}
     */
    clearScores (level) {
      if (!level) return
      this.storageKey = `memory_highscores_level${level}`
      localStorage.removeItem(this.storageKey)
      this.scores = []
      this.render()
    }

    /**
     * Renders the high score table.
     *
     * Updates the headin based o the active level,
     * highlights the most recednt score entry,
     * and displays a fallback message if no scores exists.
     *
     * @returns {void}
     */
    render () {
      this.tbody.innerHTML = ''
      this.h3 = this.shadowRoot.querySelector('#top')
      const displayLevel = this.levelMap[this.currentLevel] ?? this.currentLevel
      this.h3.textContent = `Top 5 - Level ${displayLevel}`

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

    /**
     * Dispatches a custom event to signal that the high score modal should be closed.
     * This event bubbles up and can cross the shadow DOM boundary.
     */
    closeHighScore () {
      this.dispatchEvent(new CustomEvent('highscore-back', {
        bubbles: true,
        composed: true
      }))
    }
  })
