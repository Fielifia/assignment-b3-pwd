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
    this.initDock()
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

  /**
   * Initializes the dock with applicaiton icons and click events.
   *
   * @returns {void}
   */
  initDock () {
    const apps = [
      { title: 'Chat', iconText: '💬' },
      { title: 'Memory', iconText: '🧠' }
    ]

    apps.forEach(app => {
      const icon = document.createElement('div')
      icon.classList.add('dock-icon')
      icon.textContent = app.iconText
      icon.title = app.title

      // Click event opens a new window
      icon.addEventListener('click', () => {
        const win = this.createWindow(app.title)
        this.focusWindow(win)
      })

      this.dockContainer.appendChild(icon)
    })
  }

  /**
   * Creates a new window element in the PWD.
   *
   * @param {string} title - The title of the window.
   * @returns {HTMLElement} The created window element.
   */
  createWindow (title) {
    const win = document.createElement('div')
    win.classList.add('window')
    win.dataset.windowId = this.state.nextWindowId

    // Add a simple titel bar
    const titleBar = document.createElement('div')
    titleBar.classList.add('title-bar')
    titleBar.textContent = title
    win.appendChild(titleBar)

    // Position window at a default spot
    win.style.position = 'absolute'
    win.style.top = `${50 + this.state.nextWindowId * 30}px`
    win.style.left = `${50 + this.state.nextWindowId * 30}px`
    win.style.width = '300px'
    win.style.height = '200px'
    win.style.zIndex = this.topZ

    this.windowContainer.appendChild(win)

    this.state.openWindows.push({
      id: this.state.nextWindowId,
      element: win
    })
    this.state.nextWindowId++

    return win
  }

  /** Brings the specified window to the fron by updating z-index.
   *
   * @param {HTMLElement} win - The window to focus.
   * @returns {void}
   */
  focusWindow (win) {
    if (!win) return
    this.topZ++
    win.style.zIndex = this.topZ

    this.state.focusedWindows = win.dataset.windowId
  }
}

// Start the application
new PwdShell()
