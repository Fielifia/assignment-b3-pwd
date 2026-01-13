/**
 * ChannelPicker web component.
 *
 * Displays chat channels as selectable buttons..
 * Dispatches a `channel-change` event whether the selection changes.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 2.0
 * @augments HTMLElement
 */
const template = document.createElement('template')
template.innerHTML = `
<style>

.channels {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.channel-btn {
  padding: .2rem .3rem;
  border-radius: 6px;
  border: none;
  background: #8fb3cc;
  font-weight: 500;
  font-size: .7rem;
  transition: .2s ease;
  cursor: pointer;
}

button:focus {
  outline: none;
}

.channel-btn:hover, .channel-btn:focus-visible {
  background: #5f86a1;
  transform: scale(1.05);
  cursor: pointer;
}
</style>
<div class="channels" role="group" aria-label="Chat channels">
<button class="channel-btn" data-channel="default" aria-pressed="false">Default</button>
<button class="channel-btn" data-channel="general" aria-pressed="false">General</button>
<button class="channel-btn" data-channel="myChannel" aria-pressed="false">My Channel</button>
</div>
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

    this.buttons = [...this.shadowRoot.querySelectorAll('button')]
    this._value = 'default'
  }

  /**
   * Lifecycle callback.
   * Adds the `change` event listener to dispatch `channel-change`.
   */
  connectedCallback () {
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') return

      const channel = e.target.dataset.channel
      if (channel === this._value) return

      this._value = channel

      this.buttons.forEach(btn => {
        btn.setAttribute('aria-pressed', btn.dataset.channel === channel)
      })
      console.log('Channel changed to:', channel)

      this.dispatchEvent(new CustomEvent('channel-change', {
        detail: channel,
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
    return this._value
  }

  /**
   * Sets the currently selected channel.
   *
   * @param {string} val - The channel value to select.
   * @returns {void}
   */
  set value (val) {
    this._value = val

    this.buttons.forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.channel === val)
    })
  }
}
customElements.define('channel-picker', ChannelPicker)
