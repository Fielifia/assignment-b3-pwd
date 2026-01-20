export const Storage = {
  /**
   * Retrieves data from localStorage.
   *
   * @param {string} key - The localStorage key to retrieve data from.
   * @returns {any|null} Parsed JSON object/array or null if nothing is found or parsing fails.
   */
  get (key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}"`, error)
      return null
    }
  },

  /**
   * Stores data in localStorage under the specified key.
   *
   * @param {string} key - The localStorage key to store data under.
   * @param {any} value - The data to store (object, array, string, number, etc).
   * @returns {void}
   */
  set (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}"`, error)
    }
  },

  /**
   * Removes data from localStorage by key.
   *
   * @param {string} key - The localStorage key to remove.
   * @returns {void}
   */
  remove (key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}"`, error)
    }
  }
}
