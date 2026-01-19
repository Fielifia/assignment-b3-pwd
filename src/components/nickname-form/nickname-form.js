/**
 * The nickname-form web component.
 *
 * Ask user for a nickname, validates the input and dispatches
 * a custom event 'nickname-submitted' with the nickname.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 2.0.0
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
* {
    font-family: 'Montserrat', Arial, Helvetica, sans-serif;
    box-sizing: border-box;
}

:host {
    background: none;
    color: #000;
}

form {
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
  margin: .5rem auto;
}

label {
  padding: 0 .5rem;
  text-transform: uppercase;
  text-align: center;
}

input {
  padding: .5rem;
  width: 100%;
}

button {
  padding: .5rem 1rem;
  border-radius: 6px;
  border: none;
  background: #8fb3cc;
  color: #000;
  text-transform: uppercase;
  transition: .2s ease;
  cursor: pointer;
}

button:hover{
  background: #5f86a1;
  transform: scale(1.05);
  cursor: pointer;
}
:focus-visible {
  outline: 2px solid #5f86a1;
}
.error-msg {
  margin: 1rem auto;
}

:host([variant="sidebar"]) {
  padding: 0;
  margin: 0;
  width: 100%;
}
:host([variant="sidebar"]) form {
  padding: 0;
  margin: 0;
  font-size: .6rem;
}

:host([variant="sidebar"]) .nickname-input {
  flex-direction: column;
  gap: .5rem;
}

:host([variant="sidebar"]) label {
  margin: 0 auto;
  padding: 0;
}

:host([variant="sidebar"]) input {
  margin: 0;
  padding: .2rem .5rem;
  font-size: .6rem;
}

:host([variant="sidebar"]) button {
  width: 100%;
  padding: .2rem;
  margin: 0;
  font-size: .6rem;
}
</style>
<form novalidate>
<label for="nickname">Enter nickname:</label>
<div class="nickname-input">
<input type="text" id="nickname" minlength="2">
<button type="submit">Play</button>
</div>
<p class="error-msg" style="display: none;">Enter a nickname!</p>
</form>
`
/**
 * Web component that renders nickname input form.
 *
 * Validates user input and emits a custom event when
 * a valid nickname has been submitted.
 */
export class NicknameForm extends HTMLElement {
  /**
   * Creates an instance of the nickname form component.
   *
   * Attaches a shadow DOM, initializes internal element references,
   * and registers the submit event handler.
   */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.formEl = this.shadowRoot.querySelector('form')
    this.inputEl = this.shadowRoot.querySelector('#nickname')
    this.errorEl = this.shadowRoot.querySelector('.error-msg')

    this.formEl.addEventListener('submit', (e) => this.#onSubmit(e))
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
      this.shadowRoot.querySelector('button').textContent =
        this.getAttribute('button-text')
    }
  }

  /**
   * Defines which attributes the component observes for changes.
   *
   * - `label-text`: Custom label text.
   * - `button-text`: Custom button text.
   * - `variant`: Visual variant (e.g. sidebar).
   *
   * @returns {string[]} An array of attribute names to observe
   */
  static get observedAttributes () {
    return ['button-text', 'label-text', 'variant']
  }

  /**
   * Reacts to changes in observed attributes and updates
   * the component UI accordingly.
   *
   * @param {string} name - Name of the change
   * @param {string|null} oldValue - Previous value
   * @param {string|null} newValue - New value
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (oldValue === newValue) return
    if (name === 'button-text') {
      this.shadowRoot.querySelector('button').textContent = newValue
    }

    if (name === 'label-text') {
      this.shadowRoot.querySelector('label').textContent = newValue
    }
  }

  /**
   * Handles form submission.
   *
   * Validates the nickname input and dispatches a
   * `nickname-submitted` event if valid.
   *
   * @param {SubmitEvent} event - The submit event triggered by the form.
   * @private
   */
  #onSubmit (event) {
    event.preventDefault()

    const nickname = this.inputEl.value.trim()

    if (!nickname) {
      this.errorEl.style.display = 'block'
      return
    }

    this.errorEl.style.display = 'none'

    this.dispatchEvent(
      new CustomEvent('nickname-submitted', {
        detail: nickname,
        bubbles: true,
        composed: true
      })
    )
  }
}
customElements.define('nickname-form', NicknameForm)
