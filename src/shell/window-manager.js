import { makeDraggable } from '../ui/draggable.js'
import { APP_TAGS, APP_LOADERS, WINDOW_OFFSET, INITIAL_Z_INDEX } from './constants.js'
import { updateDock } from '../ui/updateDock.js'
const template = document.createElement('template')
template.innerHTML = `
<style>
</style>
    <div class="window" tabindex="0">
    <div class="title-bar" tabindex="0">
    <span class="title-bar-title"></span>
    <div class="title-bar-buttons">
    <button class="minimize-btn" aria-label="Minimize window">🗕</button>
    <button class="close-btn" aria-label="Close window">✖</button>
    </div>
    </div>
    <div class="content"></div>
    </div>
`

/**
 * Manages creation, focus, minimize, and closing of application windows.
 */
export class WindowManager {
  /**
   * Initializes a WindowManager instance.
   *
   * @param {HTMLElement} container - The container for all windows.
   * @param {HTMLElement} dockContainer - The container for dock icons.
   */
  constructor (container, dockContainer) {
    this.container = container
    this.dockContainer = dockContainer
    this.windows = []
    this.minimized = {}
    this.topZ = INITIAL_Z_INDEX
    this.nextId = 1
  }

  /**
   * Creates a new window with the specified title and app type.
   *
   * @param {string} title - The window title.
   * @param {string} appType - The application type key.
   * @returns {HTMLElement} The created window element.
   */
  async createWindow (title, appType) {
    const win = template.content.cloneNode(true).querySelector('.window')
    win.dataset.windowId = this.nextId
    win.dataset.appType = appType

    win.style.top = `${20 + this.nextId * WINDOW_OFFSET}px`
    win.style.left = `${20 + this.nextId * WINDOW_OFFSET}px`
    win.style.zIndex = this.topZ

    const titleBar = win.querySelector('.title-bar')
    const titleBarTitle = win.querySelector('.title-bar-title')
    titleBarTitle.textContent = title

    const minimizeBtn = win.querySelector('.minimize-btn')
    const closeBtn = win.querySelector('.close-btn')
    const content = win.querySelector('.content')

    if (!APP_LOADERS[appType] || !APP_TAGS[appType]) {
      console.warn(`Unknown appType: ${appType}`)
      return win
    }
    try {
      await APP_LOADERS[appType]()
      content.appendChild(document.createElement(APP_TAGS[appType]))
    } catch (error) {
      console.error(`Failed to load app: ${appType}`, error)
      content.textContent = 'Could not load application.'
    }

    makeDraggable(win, titleBar)

    win.addEventListener('mousedown', () => this.focusWindow(win))
    minimizeBtn.addEventListener('click', () => this.mimimizeWindow(win))
    closeBtn.addEventListener('click', () => this.closeWindow(win))

    this.container.appendChild(win)

    this.windows.push(win)
    this.nextId++

    return win
  }

  /**
   * Brings the given window to front by increasing z-index.
   *
   * @param {HTMLElement} win - The window to focus.
   */
  focusWindow (win) {
    this.topZ++
    win.style.zIndex = this.topZ
  }

  /**
   * Closes the given window and removes it from the manager.
   *
   * @param {HTMLElement} win - The window to remove.
   */
  closeWindow (win) {
    win.remove()
    this.windows = this.windows.filter(w => w !== win)
    const appType = win.dataset.appType
    if (this.minimized[appType]) {
      this.minimized[appType] = this.minimized[appType].filter(w => w !== win)
      updateDock.call(this, appType)
    }
  }

  /**
   * Minimizes the given window and updates the dock.
   *
   * @param {HTMLElement} win - The window to minimize.
   */
  mimimizeWindow (win) {
    const appType = win.dataset.appType
    win.style.display = 'none'
    if (!this.minimized[appType]) this.minimized[appType] = []
    this.minimized[appType].push(win)

    updateDock.call(this, appType)
  }
}
