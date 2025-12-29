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
}

// Start the application
new PwdShell()
