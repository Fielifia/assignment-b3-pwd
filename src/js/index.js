/**
 * Entry point for the Progresive Web Desktop application.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 1.0.0
 */
class PwdShell {
  /**
   * Creates an instance of the PWD Shell.
   */
  constructor () {
    // Root element for the entire application
    this.root = document.querySelector('#pwd-root')

    if (!this.root) {
      throw new Error('PWD root element not found.')
    }

    // Global application stat (will be expanded later)
    this.state = {
      openWindows: [],
      focusedWindows: null,
      nextWindowId: 1
    }

    this.topZ = 1

    this.createLayout()
  }

  /**
   * Creates a basic layout of the PWD Shell.
   *
   * This method creates two main containers inside the root element:
   * 1. A container for application windows (`window-container`).
   * 2. A container for the dock (`dock-container`)
   *
   * These continers are appended directly to the root element (`pwd-root`).
   *
   * @returns {void} This method does not return a value.
   */
  createLayout () {
    this.windowContainer = document.createElement('div')
    this.windowContainer.classList.add('window-container')

    this.dockContainer = document.createElement('div')
    this.dockContainer.classList.add('dock-container')

    this.root.appendChild(this.windowContainer)
    this.root.appendChild(this.dockContainer)
  }

  /** Brings the specified window to the fron by updating z-index.
   * 
   * @param {HTMLElement} win - The window to focus.
   * @returns {void}
   */
  focusWindow(win) {
    if(!win) return
    this.topZ++
    win.style.zIndex = this.topZ

    this.state.focusedWindows = win.dataset.windowId
  }
}

// Start the application
const shell = new PwdShell()
const win = document.querySelector('.test-window')
shell.focusWindow(win)
