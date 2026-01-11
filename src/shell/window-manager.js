import { makeDraggable } from '../ui/draggable.js'
import { APP_TAGS, WINDOW_OFFSET, INITIAL_Z_INDEX } from './constants.js'

/**
 * Manages windows: creatin, focus, and closing.
 */
export class WindowManager {
  /**
   * Initializes a WindowManager instance.
   *
   * @param {HTMLElement} container - The container for all windows.
   */
  constructor (container) {
    this.container = container
    this.windows = []
    this.topZ = INITIAL_Z_INDEX
    this.nextId = 1
  }

  /**
   * Creates a new windos with title and app type.
   *
   * @param {string} title - The window title.
   * @param {string} appType - The application type key.
   * @returns {HTMLElement} The creates window element.
   */
  createWindow (title, appType) {
    const win = document.createElement('div')
    win.classList.add('window')
    win.dataset.windowId = this.nextId

    win.style.position = 'absolute'
    win.style.top = `${30 + this.nextId * WINDOW_OFFSET}px`
    win.style.left = `${30 + this.nextId * WINDOW_OFFSET}px`
    win.style.zIndex = this.topZ
    win.setAttribute('tabindex', '0')

    const titleBar = document.createElement('div')
    titleBar.classList.add('title-bar')
    titleBar.textContent = title
    titleBar.setAttribute('tabindex', '0')

    const closeBtn = document.createElement('button')
    closeBtn.classList.add('close-btn')
    closeBtn.textContent = '✖'
    titleBar.appendChild(closeBtn)

    titleBar.appendChild(closeBtn)
    win.appendChild(titleBar)

    const content = document.createElement('div')
    content.classList.add('content')
    win.appendChild(content)

    const tag = APP_TAGS[appType]
    const appEl = tag ? document.createElement(tag) : document.createElement('div')
    content.appendChild(appEl)

    makeDraggable(win, titleBar)

    win.addEventListener('mousedown', () => this.focusWindow(win))
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
  }
}
