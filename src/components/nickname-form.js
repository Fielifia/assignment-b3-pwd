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
* {
    font-family: 'Montserrat', Arial, Helvetica, sans-serif;
}

:host {
    background: #none;
    color: #000;
}
#nickname-container {
  display: flex;
  font-size: clamp(.9rem, 1.5vw + .6rem, 1rem);
  flex-direction: column;  
  padding: 1rem;
}
.nickname-input {
  display: flex;
  gap: 1rem;
  width: 100%;
}
label, .nickname-input, .error-msg {
  margin: clamp(.5rem, 1vw, 1rem) auto;
}
label, #submit {
  padding: .5rem clamp(1.5rem, 2vw, 2.5rem);
  text-transform: uppercase;
}
input {
  padding: .5rem;
  width: 100%;
}
:focus-visible {
  outline: 2px solid #5f86a1;
}
.error-msg {
  color: #ff6b6b;
}
button {
  padding: .5rem 1rem;
  border-radius: 6px;
  border: none;
  background: #8fb3cc;
  color: #000;
  text-transform: uppercase;
  font-weight: 500;
  transition: .2s ease;
  cursor: pointer;
}

button:hover{
  background: #5f86a1;
  transform: scale(1.05);
  cursor: pointer;
}
</style>
<div id="nickname-container">
<label for="nickname">Enter your nickname:</label>
<div class="nickname-input">
<input type="text" id="nickname">
<button id="submit">Play</button>
</div>
<p id="error-msg" class="error-msg" style="display: none;">Enter a nickname!</p>
</div>
`
/**
 * @class
 * @augments HTMLElement
 */
customElements.define(
  'nickname-form',
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

      if (this.hasAttribute('label-text')) {
        this.shadowRoot.querySelector('label').textContent =
          this.getAttribute('label-text')
      }

      if (this.hasAttribute('button-text')) {
        this.shadowRoot.querySelector('#submit').textContent =
          this.getAttribute('button-text')
      }
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

      this.dispatchEvent(
        new CustomEvent('nickname-submitted', {
          detail: nickname,
          bubbles: true,
          composed: true
        })
      )
    }
  }
)
