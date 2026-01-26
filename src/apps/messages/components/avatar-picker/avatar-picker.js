/**
 * Avatar selection component.
 *
 * Presents a list of avatars for the user to choose from.
 * Dispatches a custom event 'avatar-selected' with the selected avatar.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @augments HTMLElement
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
.avatar-wrapper {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    font-size: clamp(.9rem, 1.5vw + .6rem, 1rem);
    justify-content: center;
    align-items: center;
    margin-top: 0;
    border-radius: 6px;
    text-transform: uppercase; 
    padding: .5rem;
}

label {
    margin: .5rem auto;
    text-align: center;
}

#avatar-list {
    display: flex;
    gap: .5rem;
    flex-wrap: wrap;
    justify-content: center;
}
#avatar-list span {
    cursor: pointer;
    transition: transform .1s ease;
}
#avatar-list span:hover {
    transform: scale(1.2);
}
#avatar-list span.selected {
    transform: scale(1.6);
}

:focus {
    outline: 2px solid #4d5f6a;
}
.error-msg {
    color: #ff6b6b;
}

:host([variant="sidebar"]) {
  padding: 0;
  margin: 0;
  width: 100%;
}

:host([variant="sidebar"]) .avatar-wrapper {
  flex-direction: column;
  gap: .5rem;
}

:host([variant="sidebar"]) label {
  padding: 0;
  margin: 0 auto;
  font-size: .6rem;
}

:host([variant="sidebar"]) #avatar-list {
  display: flex;
  gap: .2rem;
  flex-wrap: wrap;
  justify-content: center; margin: 0;
  font-size: .6rem;
}
</style>

<div class="avatar-wrapper">
<label for="select-avatar">Select avatar:</label>
<div id="avatar-list"></div>
<p id="error-msg" class="error-msg" style="display: none;">Select an avatar!</p>
</div>
`
/**
 * AvatarPicker component class.
 */
export class AvatarPicker extends HTMLElement {
  /**
   * Creates an instance of AvatarPicker.
   * Inializes avatar list and internal state.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    // Default avatars, or read from attribute
    this.avatars = this.getAttribute('avatars')
      ? this.getAttribute('avatars').split(',')
      : ['😃', '😎', '🤖', '👽', '🐱', '🐶', '🦊', '🐸', '🐵', '🦄']

    this.avatarList = this.shadowRoot.querySelector('#avatar-list')
    this.selectedEl = this.shadowRoot.querySelector('.selected-avatar')
    this.errorEl = this.shadowRoot.querySelector('#error-msg')
    this.selectedAvatar = null
  }

  /**
   * Lifecycle callback invoked when the ellement is connected to the DOM.
   * Renders avilable avatars.
   */
  connectedCallback () {
    this.renderAvatars()
  }

  /**
   * List of attributes to observe for changes.
   * Needed for variant support.
   *
   * @returns {string[]} Array of observed attribute names
   */
  static get observedAttributes () {
    return ['variant']
  }

  /**
   * Renders all avatars and attaches click event listeners.
   * Dispatches `avatar-selected` when an avatar i chosen.
   *
   * @returns {void}
   */
  renderAvatars () {
    this.avatarList.innerHTML = ''
    this.avatars.forEach((a) => {
      const span = document.createElement('span')
      span.textContent = a

      span.addEventListener('click', () => {
        // Update internal state
        this.selectedAvatar = a
        this.errorEl.style.display = 'none'

        // Remove previous selection styling
        this.avatarList
          .querySelectorAll('span')
          .forEach((s) => s.classList.remove('selected'))

        span.classList.add('selected')

        // Dispatch custom event to parent when an avatar is selected
        this.dispatchEvent(
          new CustomEvent('avatar-selected', {
            detail: { avatar: a },
            bubbles: true,
            composed: true
          })
        )
      })
      this.avatarList.appendChild(span)
    })
  }

  /**
   * Validates is user has selected an avatar.
   *
   * @returns {boolean} True if an avatar is selected, false otherwise.
   */
  validateSelection () {
    if (!this.selectedAvatar) {
      this.errorEl.style.display = 'block'
      return false
    }
    return true
  }
}

customElements.define('avatar-picker', AvatarPicker)
