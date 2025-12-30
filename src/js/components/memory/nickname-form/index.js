/**
 * The nickname-form web component.
 *
 * Ask user for a nickname, validates the input and dispatches
 * a custom event 'nickname-submitted' with the nickname.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 */
// Template for shadow DOM
const template = document.createElement('template')
template.innerHTML = `
<style>
#nickname-container {
  display: flex;
  font-size: clamp(.9rem, 1.5vw + .6rem, 1rem);
  flex-direction: column;
}
label, input, .error-msg, #submit {
  margin: clamp(.5rem, 1vw, 1rem) auto 0;
}
label, #submit {
  padding: .5rem clamp(1.5rem, 2vw, 2.5rem);
  text-transform: uppercase;
}
input {
  padding: .5rem;
}
:focus {
  outline: 2px solid #abc9e7;
  outline-offset: 2px;
}
.error-msg {
  color: #ff6b6b;
}
#submit {
  background: #5692ce;
  border-radius: 2rem;
  font-family: 'Atma', 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  color: #fff;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}
#submit:hover {
  transform: scale(1.03);
}
</style>
<div id="nickname-container">
<label for="nickname">Enter your nickname:</label>
<input type="text" id="nickname">
<p id="error-msg" class="error-msg" style="display: none;">Enter a nickname!</p>
<button id="submit">OK</button>
</div>
`
/**
 * @class
 * @augments HTMLElement
 */
customElements.define('nickname-form',
  /**
   * Nickname form component.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of a nickname-form.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.inputEl = this.shadowRoot.querySelector('#nickname')
      this.buttonEl = this.shadowRoot.querySelector('#submit')

      // Click handler
      this.buttonEl.addEventListener('click', () => this.#submit())

      // Enter key handler
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.#submit()
      })
    }

    /**
     * Lifecycle callback invoked when the element is added to the DOM.
     * Automatically sets focus on the nickname input field.
     *
     * @override
     */
    connectedCallback () {
      this.inputEl.focus()
    }

    /**
     * Handles the submit action:
     * validates the nickname and dispatches a 'nickname-submitted' event.
     *
     * @private
     */
    #submit () {
      const nickname = this.inputEl.value.trim()
      const errorEl = this.shadowRoot.querySelector('#error-msg')

      if (!nickname) {
        errorEl.style.display = 'block'
        console.log('Enter a nickname!')
        return
      }

      errorEl.style.display = 'none'

      this.dispatchEvent(new CustomEvent('nickname-submitted', {
        detail: nickname,
        bubbles: true,
        composed: true
      }))
    }
  }
)
