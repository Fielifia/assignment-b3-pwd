/**
 * Updates dock icons and their badges.
 *
 * @param {string} appType - The application type key.
 */
export function updateDock (appType) {
  const dockContainer = this.dockContainer
  const minimized = this.minimized
  const count = minimized[appType]?.length || 0

  // Find existing dock icon or create a new one
  let icon = dockContainer.querySelector(`.dock-icon[data-app-type='${appType}']`)
  if (!icon) {
    icon = document.createElement('div')
    icon.classList.add('dock-icon')
    icon.dataset.appType = appType
    dockContainer.appendChild(icon)
  }

  icon.dataset.count = count

  // Create or update badge to show number of minimized windows
  let badge = icon.querySelector('.badge')
  if (!badge) {
    badge = document.createElement('span')
    badge.classList.add('badge')
    icon.appendChild(badge)
  }
  badge.textContent = count > 0 ? count : ''
  badge.style.display = count > 0 ? 'flex' : 'none'
  if (!count) {
    // If no minimized windows, remove popup if it exists
    const popup = icon.querySelector('.popup')
    if (popup) popup.remove()
    return
  }

  // Create or clear popup for minimized windows
  let popup = icon.querySelector('.popup')
  if (!popup) {
    popup = document.createElement('div')
    popup.classList.add('popup')
    icon.appendChild(popup)
  }

  popup.innerHTML = ''

  // Add each minimized windows as a clickable item in popup
  minimized[appType]?.forEach(w => {
    const titelEl = document.createElement('div')
    titelEl.classList.add('popup-titel-el')
    titelEl.textContent = w.querySelector('.title-bar-title').textContent

    titelEl.addEventListener('click', (event) => {
      event.stopPropagation()
      // Restore window when clicked
      w.style.display = 'block'
      this.focusWindow(w)
      minimized[appType] = minimized[appType].filter(win => win !== w)
      updateDock.call(this, appType)
    })
    popup.appendChild(titelEl)
  })

  /**
   * Shows the minimized windows popup when hovering over the icon.
   *
   * @returns {void}
   */
  icon.onmouseenter = () => {
    if (popup.children.length > 0) popup.style.display = 'block'
  }

  /**
   * Hides the minimized windows popup when not hovering over the icon.
   *
   * @returns {void}
   */
  icon.onmouseleave = () => {
    popup.style.display = 'none'
  }
}
