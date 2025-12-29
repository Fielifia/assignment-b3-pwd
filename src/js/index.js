import './components/memory/memory-app.js'
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
   * Initializes the dock with applicaiton icons.
   *
   * Each icon represents a sub-application and is clickable.
   * When an icon is clicked, a new window is created for the app and focused.
   *
   * @returns {void}
   */
  initDock () {
    const apps = [
      { title: 'Chat', iconText: '💬', type: 'chat' },
      { title: 'Memory', iconText: '🧠', type: 'memory' },
      { title: 'Custom', iconText: '💫', type: 'custom' }
    ]

    apps.forEach(app => {
      const icon = document.createElement('div')
      icon.classList.add('dock-icon')
      icon.textContent = app.iconText
      icon.title = app.title

      // Click event opens a new window
      icon.addEventListener('click', () => {
        const win = this.createWindow(app.title, app.type)
        this.focusWindow(win)
      })

      this.dockContainer.appendChild(icon)
    })
  }

  /**
   * Creates a new window element in the PWD.
   *
   * Adds a title bar, close button, default position, and z-index.
   * The new window is appended to the window container and tracked in
   * the global state.
   *
   * @param {string} title - The title of the window.
   * @param {string} appType - The type of the sub-app to inject.
   * @returns {HTMLElement} The created window element.
   */
  createWindow (title, appType) {
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
    win.style.width = 'auto'
    win.style.height = 'auto'
    win.style.zIndex = this.topZ

    this.windowContainer.appendChild(win)

    this.state.openWindows.push({
      id: this.state.nextWindowId,
      element: win,
      type: appType
    })
    this.state.nextWindowId++

    // Bring window to front on click
    win.addEventListener('click', () => {
      this.focusWindow(win)
    })

    // Drag functionality
    titleBar.addEventListener('mousedown', (e) => {
      const offsetX = e.clientX - win.getBoundingClientRect().left
      const offsetY = e.clientY - win.getBoundingClientRect().top

      /**
       * Handles the window's `left`and `top` style properties
       * based on the current nmouse position and the initial offset.
       *
       * @param {MouseEvent} eMove - The mousemove event.
       * @returns {void}
       */
      const onMouseMove = (eMove) => {
        win.style.left = `${eMove.clientX - offsetX}px`
        win.style.top = `${eMove.clientY - offsetY}px`
      }

      /**
       * Handles the end of a window drag action.
       *
       * Removes the mousemove and mouseup event listeners
       * to stop the dragging behavior.
       *
       * @returns {void}
       */
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })

    const closeBtn = document.createElement('button')
    closeBtn.classList.add('close-btn')
    closeBtn.textContent = '✖'
    titleBar.appendChild(closeBtn)

    closeBtn.addEventListener('click', () => {
      this.closeWindow(win)
    })

    const content = document.createElement('div')
    content.classList.add('content')
    win.appendChild(content)

    if (appType === 'chat') {
      const chatEl = document.createElement('messages-app')
      content.appendChild(chatEl)
    } else if (appType === 'memory') {
      const memoryEl = document.createElement('memory-app')
      content.appendChild(memoryEl)
    } else if (appType === 'custom') {
      const customEl = document.createElement('div')
      content.appendChild(customEl)
    }

    return win
  }

  /** Brings the specified window to the front by updating z-index.
   *
   * Updates the global state to reflect the currently focused window.
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

  /**
   * Closes a given window and removes it from both the DOM
   * and the global state.
   *
   * If the closed window was focused, clears the focus in the state.
   *
   * @param {HTMLElement} win - The window element to close.
   * @returns {void}
   */
  closeWindow (win) {
    if (!win) return

    // Remove from DOM
    win.remove()

    // Remove from state
    this.state.openWindows = this.state.openWindows.filter(w => w.element !== win)

    // Clear focus if needed
    if (this.state.focusedWindows === win.dataset.windowId) {
      this.state.focusedWindows = null
    }
  }
}

// Start the application
new PwdShell()
