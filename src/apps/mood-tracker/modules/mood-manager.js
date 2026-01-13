export const MoodManager = {
  key: 'mood-tracker-entries',

  /**
   * Retrieves all mood entries from localStorage.
   *
   * @returns {Array<object>} Array of mood entry objects.
   */
  getEntries () {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || []
    } catch {
      return []
    }
  },

  /**
   * Adds a new mood entry to localStorage.
   *
   * @param {object} entry - The mood entry to add.
   * @returns {Array<object>} Updated array of mood entry objects.
   */
  addEntry (entry) {
    const entries = this.getEntries()
    entries.push(entry)
    localStorage.setItem(this.key, JSON.stringify(entries))
    return entries
  },

  /**
   * Deletes a mood entry by date from localStorage.
   *
   * @param {string} date - The date of the entry to delete.
   * @returns {Array<object>} Updated array of mood entry objects.
   */
  deleteEntry (date) {
    let entries = this.getEntries()
    entries = entries.filter(e => e.date !== date)
    localStorage.setItem(this.key, JSON.stringify(entries))
    return entries
  },

  /**
   * Updates an existing mood entry in localStorage.
   *
   * @param {string} date - The date of the entry to update.
   * @param {object} newEntry - The new mood entry data.
   * @returns {Array<object>} Updated array of mood entry objects.
   */
  updateEntry (date, newEntry) {
    const entries = this.getEntries()
    entries.map(e => e.date === date ? newEntry : e)
    localStorage.setItem(this.key, JSON.stringify(entries))
    return entries
  }
}
