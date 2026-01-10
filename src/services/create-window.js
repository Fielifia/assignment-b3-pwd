import { makeDraggable } from '../components/make-draggable.js'
const desktop = document.querySelector('.desktop')
let topZ = 1
let instanceCount = 0

/**
 * Creates a draggable window on the desktop.
 *
 * The window includes a title bar, a content container for sub-apps,
 * a close button, and automatic z-index handling when focused.
 *
 * @param {string} title - The title displayed in the window header.
 * @param {string} type - The type of application (used for identifying the window).
 * @returns {HTMLDivElement} The created window element.
 */
export function createWindow (title, type) {
  instanceCount++

  /** @type {HTMLDivElement} */
  const win = document.createElement('div')
  win.classList.add('window')
  win.dataset.type = type
  win.dataset.instance = instanceCount

  win.innerHTML = `
    <header>${title}</header>
    <div class="content"></div>
    <button class="close">
    <i class="fa-solid fa-xmark"></i>
    </button>
    `
  desktop.appendChild(win)

  // Make the window draggable
  makeDraggable(win)

  /**
   * Closes the window when the close button is clicked.
   */
  win.querySelector('.close').addEventListener('click', () => {
    desktop.removeChild(win)
  })

  /**
   * Brings the window to the front when clicked.
   */
  win.addEventListener('mousedown', () => {
    topZ++
    win.style.zIndex = topZ
  })

  return win
}
