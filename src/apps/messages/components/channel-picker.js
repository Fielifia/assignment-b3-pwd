/**
 * ChannelPicker web component.
 *
 * Provides a simple dropdown to select a chat channel.
 * Dispatches a `channel-change` event whether the selection changes.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 1.0
 * @augments HTMLElement
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
</style>
<label>Channel:
<select>
<option value="default">Default</option>
<option value="general">General</option>
<option value="myChannel">My Channel</option>
</select>
`
/**
 * ChannelPicker class.
 *
 * @class
 * @augments HTMLElement
 */
export class ChannelPicker extends HTMLElement {
  /**
   * Creates a ChannelPicker component.
   * Initializes shadow Dom and references the select element.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.select = this.shadowRoot.querySelector('select')
  }

  /**
   * Lifecycle callback.
   * Adds the `change` event listener to dispatch `channel-change`.
   */
  connectedCallback () {
    this.select.addEventListener('change', (e) => {
      this.dispatchEvent(new CustomEvent('channel-change', {
        detail: e.target.value,
        bubbles: true,
        composed: true
      }))
    })
  }

  /**
   * Gets the currently selected channel.
   *
   * @returns {string} The currently selected channel value.
   */
  get value () {
    return this.select.value
  }

  /**
   * Sets the currently selected channel.
   *
   * @param {string} val - The channel value to select.
   * @returns {void}
   */
  set value (val) {
    this.select.value = val
  }
}
customElements.define('channel-picker', ChannelPicker)
