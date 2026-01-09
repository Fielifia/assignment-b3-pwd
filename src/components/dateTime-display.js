/**
 * Date and/or time component.
 *
 * Displays a formatted date, time, or both.
 *
 * This is  a self-contained web component for rendering dates, times, or both.
 * It can be reused anywhere.
 *
 * Usage example:
 * <date-time-display datetime="2024-06-15T14:30:00" format="datetime"></date-time-display>
 *
 * Attributes:
 * - datetime: Optional. A date/time string (ISO format or any valid Date constructor input). Defaults to current date/time.
 * - format: Optional. One of 'date', 'time', or 'datetime'. Defaults to 'datetime'.
 * -show-seconds: Optional. Boolean attribute. If present, seconds will be displayed and updated automatically.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @augments HTMLElement
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
* {
box-sizing: border-box;
}
span {
display: block;
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
    this.intervalId = null
  }

  /**
   * Called when the element is added to the DOM.
   * Triggers initial rendering and start clock if `show-seconds` is present.
   */
  connectedCallback () {
    this.render()
    if (this.hasAttribute('show-seconds')) this.startClock()
  }

  /**
   * Called when the element i removed from the DOM.
   * Stops the clock if it is running.
   */
  disconnectedCallback () {
    this.stopClock()
  }

  /**
   * Attributes to observe for changes.
   *
   * @returns {string[]} List of observed attributes.
   */
  static get observedAttributes () {
    return ['datetime', 'format', 'show-seconds']
  }

  /**
   * Called when one of the observed attributes changes.
   * Update display or starts/stops clock based on `show-seconds`.
   *
   * @param {string} name - The name of the changed attribute.
   * @param {string|null} oldValue - The old value of the attribute.
   * @param {string|null} newValue - The new value of the attribute.
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (!oldValue !== newValue) {
      if (name === 'show-seconds') {
        if (this.hasAttribute('show-seconds')) this.startClock()
        else this.stopClock()
      } else {
        this.render()
      }
    }
  }

  /**
   * Starts a clock interval to update the display every second.
   */
  startClock () {
    this.stopClock()
    this.intervalId = setInterval(() => this.render(), 1000)
  }

  /**
   * Stops the clock interval if running.
   */
  stopClock () {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
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
    const showSeconds = this.hasAttribute('show-seconds')

    const options = {}

    if (format === 'date') {
      options.year = 'numeric'
      options.month = 'short'
      options.day = 'numeric'
    } else if (format === 'time') {
      options.hour = '2-digit'
      options.minute = '2-digit'
      if (showSeconds) options.second = '2-digit'
    } else {
      options.year = 'numeric'
      options.month = 'short'
      options.day = 'numeric'
      options.hour = '2-digit'
      options.minute = '2-digit'
      if (showSeconds) options.second = '2-digit'
    }

    this.span.textContent = datetime.toLocaleString(undefined, options)
  }
}

customElements.define('date-time-display', DateTimeDisplay)
