/**
 * Makes an element draggable by a handle element.
 *
 * The element will follow the mouse movements when the handle is dragged.
 *
 * @param {HTMLElement} element - The element to move.
 * @param {HTMLElement} handle - The element used to drag.
 */
export function makeDraggable (element, handle) {
  let offsetX = 0
  let offsetY = 0

  /**
   * Handles mouse move events to reposition the element.
   *
   * @param {MouseEvent} e - The mousemove event.
   */
  const onMouseMove = (e) => {
    element.style.left = `${e.clientX - offsetX}px`
    element.style.top = `${e.clientY - offsetY}px`
  }

  /**
   * Handles mouse up events to stop dragging.
   */
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  handle.addEventListener('mousedown', (e) => {
    offsetX = e.clientX - element.getBoundingClientRect().left
    offsetY = e.clientY - element.getBoundingClientRect().top

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })
}
