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
    if (!entry.id) entry.id = crypto.randomUUID()
    const entries = this.getEntries()
    entries.push(entry)
    localStorage.setItem(this.key, JSON.stringify(entries))
    return entries
  },

  /**
   * Deletes a mood entry by id from localStorage.
   *
   * @param {string} id - Unique identifier of the entry to delete.
   * @returns {Array<object>} Updated array of mood entry objects.
   */
  deleteEntry (id) {
    const entries = this.getEntries().filter(e => e.id !== id)
    localStorage.setItem(this.key, JSON.stringify(entries))
    return entries
  },

  /**
   * Updates an existing mood entry in localStorage.
   *
   * @param {string} id - nique identifier of the entry to update.
   * @param {object} newEntry - The new mood entry data.
   * @returns {Array<object>} Updated array of mood entry objects.
   */
  updateEntry (id, newEntry) {
    const entries = this.getEntries()
    const updated = entries.map(e => e.id === id ? { ...e, ...newEntry } : e)
    localStorage.setItem(this.key, JSON.stringify(updated))
    return updated
  }
}
