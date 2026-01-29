/**
 * Adds mouse and keyboard activation behavior to an element.
 *
 * Enables activation via click, Enter, or Space key.
 *
 * @param {HTMLElement} element - The element to attach listeners to.
 * @param {Function} handler - The function to execute on activation.
 */
export function addActivateListener (element, handler) {
  element.addEventListener('click', handler)

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handler()
    }
  })
}
