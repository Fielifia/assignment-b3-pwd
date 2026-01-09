/**
 * Renders all messages in the message list.
 * Scrolls to the latest message automatically.
 *
 * @param {HTMLElement} messagesList - The container element where messages will be rendered.
 * @param {Array<object>} messages - Array of messages objects to render.
 * @param {('me' | 'them')[][]} messages[].from - Who sent the message: 'me' or 'them'.
 * @param {string} messages[].username - The username of the sender.
 * @param {string} messages[].avatar - Tha avatar of the sender (emoji or character).
 * @param {string} messages[].text - The message text.
 * @param {string} messages[].timestampe - ISO string timestampe of when the message was sent.
 * @param {function(number): void} removeCallback - Callback function to remove a message by index.
 * @returns {void}
 */
export function renderMessages (messagesList, messages, removeCallback) {
  messagesList.innerHTML = ''

  messages.forEach((m, index) => {
    const msgEl = document.createElement('div')
    msgEl.classList.add('message', m.from)

    const msgContent = document.createElement('div')
    msgContent.classList.add('message-content', m.from)

    const bodyEl = document.createElement('div')
    bodyEl.classList.add('message-body')

    const avatarEl = document.createElement('span')
    avatarEl.classList.add('avatar-el')
    avatarEl.textContent = m.avatar

    const textContainer = document.createElement('div')
    textContainer.classList.add('message-text-container')

    const usernameEl = document.createElement('span')
    usernameEl.classList.add('username-el')
    usernameEl.textContent = m.username + ': '

    const textEl = document.createElement('span')
    textEl.classList.add('text-el')
    textEl.textContent = m.text

    bodyEl.appendChild(usernameEl)
    bodyEl.appendChild(textContainer)
    textContainer.appendChild(textEl)
    msgContent.appendChild(avatarEl)
    msgContent.appendChild(bodyEl)
    msgEl.appendChild(msgContent)

    const timeEl = document.createElement('date-time-display')
    timeEl.classList.add('message-time')
    timeEl.setAttribute('datetime', m.timestamp)
    timeEl.setAttribute('format', 'time')
    msgEl.append(timeEl)

    if (m.from === 'me') {
      const deleteBtn = document.createElement('button')
      deleteBtn.classList.add('delete-btn')
      deleteBtn.textContent = '🗑️'
      deleteBtn.title = 'Delete message'
      deleteBtn.addEventListener('click', () => removeCallback(index))
      textContainer.appendChild(deleteBtn)

      textContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        deleteBtn.style.display = 'block'
      })
    }
    messagesList.appendChild(msgEl)
  })
  setTimeout(() => {
    messagesList.scrollTop = messagesList.scrollHeight
  }, 50)
}
