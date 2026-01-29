/**
 * NavigationManager
 * Handles navigation between start, entry, and history pages.
 * Listens to `navigate` events and updates conmponent visibility.
 * Can store the previous page when navigating to history.
 */
export const NavigationManager = {
  /**
   * Initializes navigation handling.
   *
   * @param {HTMLElement} startPage - The start page component.
   * @param {HTMLElement} entryComponent - The mood entry component.
   * @param {HTMLElement} historyComponent - The mood history component.
   * @param {AbortSignal} signal - Optional abort signal to remove listeners automatically.
   */
  init (startPage, entryComponent, historyComponent, signal) {
    document.body.addEventListener('navigate', (e) => {
      const page = e.detail.page
      switch (page) {
        case 'entry':
          entryComponent.style.display = 'block'
          historyComponent.style.display = 'none'
          startPage.style.display = 'none'
          break
        case 'history':
          historyComponent.previousPage = e.detail.from || 'start'
          entryComponent.style.display = 'none'
          historyComponent.style.display = 'block'
          startPage.style.display = 'none'
          break
        case 'start':
          entryComponent.style.display = 'none'
          historyComponent.style.display = 'none'
          startPage.style.display = 'block'
          break
      }
    }, { signal })
  }
}
