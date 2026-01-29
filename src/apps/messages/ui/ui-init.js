/**
 * Initializes the chat UI event listeners.
 *
 * Sets up:
 * - Avatar selection events
 * - Nickname submission.
 * - Moving the avatar picker and nickname form to the sidebar.
 * - Message sending via button click or Enter key.
 *
 * @param {object} refs - DOM-references and state.
 * @param {HTMLElement} refs.avatarPicker - Avatar-picker element.
 * @param {HTMLElement} refs.usernameForm - Nickname form element.
 * @param {HTMLElement} refs.sidebar - Sidebar element.
 * @param {HTMLElement} refs.chatContainer - Chat container element.
 * @param {HTMLTextAreaElement} refs.textarea - Textarea for messge input.
 * @param {HTMLElement} refs.sendBtn - Send button element.
 * @param {object} state - State object with username/avatar.
 * @param {string} [state.username] - The currently selected username.
 * @param {string} [state.avatar] - The currently selected avatar.
 * @param {string} [state.channel] - The currently selected channel.
 * @param {Function} sendCallback - Callback function to send a new message.
 * @returns {void}
 */
export function initUI ({ avatarPicker, usernameForm, sidebar, chatContainer, textarea, sendBtn }, state, sendCallback) {
  avatarPicker.addEventListener('avatar-selected', (e) => {
    state.avatar = e.detail.avatar
    localStorage.setItem('messagesAvatar', state.avatar)
  })

  /**
   * Moves the username form and avatar picker to the sidebar,
   * adjust their "variant" attributes, and focuses on textarea.
   *
   * @private
   * @returns {void}
   */
  const moveToSidebar = () => {
    usernameForm.setAttribute('variant', 'sidebar')
    usernameForm.setAttribute('button-text', 'Ok')
    usernameForm.setAttribute('label-text', 'change username')
    avatarPicker.setAttribute('variant', 'sidebar')

    sidebar.appendChild(usernameForm)
    sidebar.appendChild(avatarPicker)

    chatContainer.style.display = 'flex'
    requestAnimationFrame(() => textarea.focus())
  }

  // Listen for nickname submission
  usernameForm.addEventListener('nickname-submitted', (e) => {
    state.username = e.detail
    localStorage.setItem('messagesUsername', state.username)
    moveToSidebar()
  })

  // If username is already set, move UI to sidebar immediately
  if (state.username) {
    moveToSidebar()
  }

  // Listen for sending message via button click
  sendBtn.addEventListener('click', () => sendCallback())

  /**
   * Adjust the height of the textarea automatically based on its content.
   *
   * Sets the height to 'auto' first to shrink it if text is deleted,
   * then sets it to the scrollHeight, capped at 50% of chat container height.
   */
  const autoResize = () => {
    const maxHeight = chatContainer.clientHeight * 0.5
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }

  textarea.addEventListener('input', autoResize)

  autoResize()

  // Listen for sending message vid Enter key
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendCallback()
    }
  })
}
