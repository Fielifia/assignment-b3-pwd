import { APP_TYPES } from './constants.js'
import { addActivateListener } from '../ui/accessibility.js'

/**
 * Handles the dock UI and app launching.
 */
export class Dock {
  /**
   * Creates a dock instance.
   *
   * @param {HTMLElement} container - The dock container element.
   * @param {object} windowManager - Instance of WindowManager.
   */
  constructor (container, windowManager) {
    this.container = container
    this.windowManager = windowManager
  }

  /**
   * Initializes the dock with app icons.
   */
  init () {
    const apps = [
      { title: 'Chat', icon: '💬', type: APP_TYPES.CHAT },
      { title: 'Memory', icon: '🧠', type: APP_TYPES.MEMORY },
      { title: 'Mood Tracker', icon: '💫', type: APP_TYPES.MOOD_TRACKER }
    ]
    apps.forEach(app => {
      const icon = document.createElement('div')
      icon.classList.add('dock-icon')
      icon.textContent = app.icon
      icon.title = app.title
      icon.setAttribute('tabindex', '0')
      icon.setAttribute('role', 'button')
      icon.setAttribute('data-app-type', app.type)

      addActivateListener(icon, async () => {
        const win = await this.windowManager.createWindow(app.title, app.type)
        if (!win) return
        this.windowManager.focusWindow(win)
        win.focus()
      })

      this.container.appendChild(icon)
    })
  }
}
