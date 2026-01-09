/**
 * Renders all messages in the message list.
 * Scrolls to the latest message automatically.
 *
 * @param {HTMLElement} messagesList - The container element where messages will be rendered.
 * @param {Array<object>} messages - Array of messages object to render.
 * @param {Function} removeCallback - Callback function to remove message by index.
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

/**
 * Adds a message and re-renders.
 *
 * @param {string} text - The message text to add.
 * @param {Array<object>} messages - The array of messages to update.
 * @param {HTMLElement} messagesList - The container element to render messages in.
 * @param {object} state - The current state object containing username and avatar.
 * @param {WebSocket} socket - WebSocket instance to send the message
 * @returns {void}
 */
export function addMessage (text, messages, messagesList, state, socket) {
  const trimmed = text.trim()
  if (!trimmed) return

  messages.push({
    from: 'me',
    username: state.username,
    avatar: state.avatar,
    text: trimmed,
    timestamp: new Date().toISOString()
  })

  renderMessages(messagesList, messages, (index) => removeMessage(index, messages, messagesList))

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'message',
      data: trimmed,
      username: state.username,
      channel: 'myChannel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }))
  }
}

/**
 * Removes a message at the given index and re-renders.
 *
 * @param {number} index - Index of the message to remove.
 * @param {Array<object>} messages - The array of messages to update.
 * @param {HTMLElement} messagesList - The container element to render messages in.
 * @returns {void}
 */
export function removeMessage (index, messages, messagesList) {
  messages.splice(index, 1)
  renderMessages(messagesList, messages, (i) => removeMessage(i, messages, messagesList))
}
