import { WindowManager } from './window-manager.js'
import { Dock } from './dock.js'
/**
 * Main shell for the Progressive Web Desktop.
 * Handles layout, window management, and the dock.
 *
 */
export class PwdShell {
  /**
   * Initializes the shell, creates layout, window manager, and dock.
   */
  constructor () {
    // References to the root element of the PWD
    // This is the container in index.html where the entire desktop UI will mount
    this.root = document.querySelector('#pwd-root')
    if (!this.root) {
      throw new Error('PWD root element not found.')
    }

    // Create main layout elements in DOM
    this.createLayout()

    // Initializes window manager, passing in the container elements
    this.windowManager = new WindowManager(this.windowContainer, this.dockContainer)

    // Initializes dock and connects it with the window manager
    this.dock = new Dock(this.dockContainer, this.windowManager)
    this.dock.init()
  }

  /**
   * Creates the main layout elements: window container and dock container.
   * Appends the to the root element.
   */
  createLayout () {
    // Container where all PWD "windows" will live
    this.windowContainer = document.createElement('div')
    this.windowContainer.classList.add('window-container')

    // Container for the dock
    this.dockContainer = document.createElement('div')
    this.dockContainer.classList.add('dock-container')

    // Append both containers to root
    this.root.appendChild(this.windowContainer)
    this.root.appendChild(this.dockContainer)
  }
}
