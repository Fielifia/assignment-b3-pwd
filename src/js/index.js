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
  }
}

// Start the application
new PwdShell()
