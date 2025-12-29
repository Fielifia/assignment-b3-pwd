/**
 * Makes a window element draggable by its header.
 *
 * Enanbles click-and-drag movement using the mouse by tracking
 * mouse events on the window's header element.
 *
 * @param {HTMLElement} win - The window element to make draggable
 * @returns {void}
 */
export function makeDraggable (win) {
  let isDragging = false; let offsetX; let offsetY

  const header = win.querySelector('header')
  header.addEventListener('mousedown', (e) => {
    if (!header) return
    isDragging = true
    offsetX = e.clientX - win.offsetLeft
    offsetY = e.clientY - win.offsetTop
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    win.style.left = e.clientX - offsetX + 'px'
    win.style.top = e.clientY - offsetY + 'px'
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
  })
}
