/**
 * StateUpdater
 * Provides helper functions to update components state when application state changes.
 */
export const StateUpdater = {
  /**
   * Updates the entries displayed in the history component.
   *
   * @param {HTMLElement & {entries: Array<object>}} historyComponent - The history component to update.
   * @param {Array<object>} entries - Array of mood entry objects.
   */
  updateHistory (historyComponent, entries) {
    historyComponent.entries = entries
  }
}
