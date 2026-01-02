/**
 * Date and/or time component.
 *
 * Displays a formatted date, time, or both.
 *
 * This is  a self-contained web component for rendering dates, times, or both.
 * It does not assume any particular usage context, so it can be reused anywhere.
 *
 * Usage example:
 * <date-time-display datetime="2024-06-15T14:30:00" format="datetime"></date-time-display>
 *
 * Attributes:
 * - datetime: Optional. A date/time string (ISO format or any valid Date constructor input). Defaults to current date/time.
 * - format: Optional. One of 'date', 'time', or 'datetime'. Defaults to 'datetime'.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @augments HTMLElement
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
* {
}
</style>
<span></span>
`
/**
 *
 */
export class DateTimeDisplay extends HTMLElement {
  /**
   * Creates an instance of DateTimeDisplay.
   * Initializes shadow DOM and references.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.span = this.shadowRoot.querySelector('span')
  }

  /**
   * Cakked when the element is added to the DOM.
   * Triggers initial rendering.
   */
  connectedCallback () {
    this.render()
  }

  /**
   * Attributes to observe for changes.
   *
   * @returns {string[]} List of observed attributes.
   */
  static get observedAttributes () {
    return ['datetime', 'format']
  }

  /**
   * Called when one of the observed attributes changes.
   * Re-renders the display.
   *
   * @param {string} name - The name of the changed attribute.
   * @param {string|null} oldValue - The old value of the attribute.
   * @param {string|null} newValue - The new value of the attribute.
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (oldValue !== newValue) this.render()
  }

  /**
   * Renders the date/time string based on the attributes.
   *
   * @returns {void}
   */
  render () {
    const datetime = this.getAttribute('datetime')
      ? new Date(this.getAttribute('datetime'))
      : new Date()

    const format = this.getAttribute('format') || 'datetime'

    if (format === 'date') {
      this.span.textContent = datetime.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } else if (format === 'time') {
      this.span.textContent = datetime.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else {
      this.span.textContent = datetime.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}

customElements.define('date-time-display', DateTimeDisplay)
