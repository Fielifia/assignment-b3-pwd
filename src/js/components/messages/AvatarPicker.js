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
.avatar-container {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    font-size: clamp(.9rem, 1.5vw + .6rem, 1rem);
    gap: .5rem;
    justify-content: center;
    align-items: center;
    margin-top: 0;
    padding: 0;
    border-radius: 6px;
    text-transform: uppercase;
}
:focus {
  outline: 2px solid #4d5f6a;
}
.error-msg {
  color: #ff6b6b;
}

#avatar-list {
    display: flex;
    gap: .5rem;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    margin: clamp(.5rem, 1vw, 1rem) auto;
}
#avatar-list span {
    cursor: pointer;
    transition: transform .1s ease;
}
#avatar-list span:hover {
    transform: scale(1.2);
}

#avatar-list span.selected {
    transform: scale(2);
}

.selected-avatar {
    margin-bottom: .5rem;
}
</style>

<div class="avatar-container">
<p class="selected-avatar">Select avatar:</p>
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

    this.avatars = this.getAttribute('avatars')
      ? this.getAttribute('avatars').split(',')
      : ['😃', '😎', '🤖', '👽', '🐱', '🐶', '🦊', '🐸', '🐵', '🦄']

    this.avatarList = this.shadowRoot.querySelector('#avatar-list')
    this.selectedEl = this.shadowRoot.querySelector('.selected-avatar')
    this.errorEl = this.shadowRoot.querySelector('#error-msg')
    this.selectedAvatar = null
  }

  /**
   * Lifecycle callback.
   * Renders avilable avatars when component is connected.
   */
  connectedCallback () {
    this.renderAvatars()
  }

  /**
   * Renders all avatars and attaches click event listeners.
   * Dispatches `avatar-selected` when an avatar i chosen.
   *
   * @returns {void}
   */
  renderAvatars () {
    this.avatarList.innerHTML = ''
    this.avatars.forEach(a => {
      const span = document.createElement('span')
      span.textContent = a

      span.addEventListener('click', () => {
        this.selectedAvatar = a
        this.errorEl.style.display = 'none'

        this.avatarList.querySelectorAll('span').forEach(s => s.classList.remove('selected'))

        span.classList.add('selected')

        this.avatarList.querySelectorAll('span').forEach(s => {
          this.dispatchEvent(new CustomEvent('avatar-selected', {
            detail: { avatar: a },
            bubbles: true,
            composed: true
          }))
        })
      })
      this.avatarList.appendChild(span)
    })
  }

  /**
   * Validates that an avatar has been selected.
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
