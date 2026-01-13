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
    this.root = document.querySelector('#pwd-root')
    if (!this.root) {
      throw new Error('PWD root element not found.')
    }

    this.createLayout()

    this.windowManager = new WindowManager(this.windowContainer, this.dockContainer)

    this.dock = new Dock(this.dockContainer, this.windowManager)
    this.dock.init()
  }

  /**
   * Creates the main layout elements: window container and dock container.
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
