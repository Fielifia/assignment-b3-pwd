/**
 * Initializes the chat UI event listeners.
 *
 * @param {object} refs - DOM-references and state.
 * @param {HTMLElement} refs.avatarPicker - Avatar-picker element.
 * @param {HTMLElement} refs.usernameForm - Nickname form element.
 * @param {HTMLElement} refs.chatContainer - Char container element.
 * @param {HTMLTextAreaElement} refs.textarea - Textarea for messge input.
 * @param {HTMLElement} refs.sendBtn - Send button element.
 * @param {object} state - State object with username/avatar.
 * @param {string} [state.username] - The currently selected username.
 * @param {string} [state.avatar] - The currently selected avatar.
 * @param {string} [state.channel] - The currently selected channel.
 * @param {() => void} sendCallback - Callback function to send a new message.
 * @returns {void}
 */
export function initUI ({ avatarPicker, usernameForm, chatContainer, textarea, sendBtn }, state, sendCallback) {
  avatarPicker.addEventListener('avatar-selected', (e) => {
    state.avatar = e.detail.avatar
    localStorage.setItem('messagesAvatar', state.avatar)
  })

  usernameForm.addEventListener('nickname-submitted', (e) => {
    state.username = e.detail
    localStorage.setItem('messagesUsername', state.username)
    usernameForm.remove()
    avatarPicker.remove()
    chatContainer.style.display = 'flex'
    requestAnimationFrame(() => textarea.focus())
  })

  if (state.username) {
    usernameForm.remove()
    avatarPicker.remove()
    chatContainer.style.display = 'flex'
    requestAnimationFrame(() => textarea.focus())
  }

  sendBtn.addEventListener('click', () => sendCallback())
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendCallback()
    }
  })
}
