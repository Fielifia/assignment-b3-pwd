/**
 * Renders all messages in the message list.
 * Scrolls to the latest message automatically.
 *
 * @param {HTMLElement} messagesList - The container element where messages will be rendered.
 * @param {Array<object>} messages - Array of messages object to render.
 * @param {Function} onDelete - Callback function to remove message by index.
 * @param {Function} [onReply] - Callback function when replying to a them-message.
 * @returns {void}
 */
export function renderMessages (messagesList, messages, onDelete, onReply) {
  messagesList.innerHTML = ''
  messages.forEach((m, index) => {
    const msgEl = createMessageElement(m, index, onDelete, onReply)
    messagesList.appendChild(msgEl)
  })
  setTimeout(() => {
    messagesList.scrollTop = messagesList.scrollHeight
  }, 50)
}
/**
 * Creates a message element DOM structure.
 *
 * @param {{from: string, username: string, avatar: string, text: string, timestamp: string, replyTo?: object, channel: string}} m - Message object.
 * @param {number} index - Index of the message.
 * @param {(index: number) => void} onDelete - Callback function for deleting a message.
 * @param {(message: object) => void} [onReply] - Optional callback function for replying to a message.
 * @returns {HTMLElement} The DOM element representing the message.
 */
function createMessageElement (m, index, onDelete, onReply) {
  const msgEl = document.createElement('div')
  msgEl.classList.add('message', m.from)

  const msgContent = document.createElement('div')
  msgContent.classList.add('message-content', m.from)

  const avatarEl = createAvatarEl(m.avatar)
  const bodyEl = createBodyEl(m, index, onDelete, onReply)

  msgContent.appendChild(avatarEl)
  msgContent.appendChild(bodyEl)
  msgEl.appendChild(msgContent)
  msgEl.appendChild(createTimeEl(m.timestamp))
  return msgEl
}

/**
 * Creates an avatar DOM element.
 *
 * @param {string} avatar - The avatar emoji.
 * @returns {HTMLElement} The span element representing the avatar.
 */
function createAvatarEl (avatar) {
  const avatarEl = document.createElement('span')
  avatarEl.classList.add('avatar-el')
  avatarEl.textContent = avatar
  return avatarEl
}

/**
 * Creates the body part of a messsage element, including username, text, reply overlay and delete button.
 *
 * @param {{from: string, username: string, avatar: string, text: string, timestamp: string, replyTo?: object, channel: string}} m - Message object.
 * @param {number} index - Index of the message.
 * @param {(index: number) => void} onDelete - Callback function for deleting a message.
 * @param {(message: object) => void} [onReply] - Optional callback function for replying to a message.
 * @returns {HTMLElement} The DOM element representing the message body.
 */
function createBodyEl (m, index, onDelete, onReply) {
  const bodyEl = document.createElement('div')
  bodyEl.classList.add('message-body')

  const usernameEl = document.createElement('span')
  usernameEl.classList.add('username-el')
  usernameEl.textContent = m.username

  const textContainer = document.createElement('div')
  textContainer.classList.add('message-text-container')
  textContainer.setAttribute('tabindex', '0')
  textContainer.setAttribute('role', 'button')

  const textEl = document.createElement('span')
  textEl.classList.add('text-el')
  textEl.textContent = m.text
  textContainer.appendChild(textEl)

  if (m.replyTo) {
    const replyUsername = document.createElement('span')
    replyUsername.classList.add('username-el')
    replyUsername.innerHTML = `<i class="fa-solid fa-reply" id="reply-arrow"></i> You replied ${m.replyTo.username}`
    bodyEl.appendChild(replyUsername)

    const replyOverlay = document.createElement('div')
    replyOverlay.classList.add('reply-overlay')

    const replyUser = document.createElement('span')
    replyUser.classList.add('reply-user')
    replyUser.innerHTML = `${m.replyTo.text}`
    replyOverlay.appendChild(replyUser)
    bodyEl.appendChild(replyOverlay)

    if (m.from === 'me') usernameEl.style.display = 'none'
  }

  bodyEl.append(usernameEl, textContainer)

  if (m.from === 'me') attachDeleteBtn(textContainer, index, onDelete)
  else if (m.from === 'them' && typeof onReply === 'function') {
    textContainer.addEventListener('click', () => onReply(m))
    textContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onReply(m)
      }
    })
  }
  return bodyEl
}

/**
 * Attaches a delete button to a message text container.
 *
 * @param {HTMLElement} textContainer - The container for the text message.
 * @param {number} index - Index of the message to delete.
 * @param {(index: number) => void} onDelete - Callback funciton to remove a message.
 * @returns {void}
 */
function attachDeleteBtn (textContainer, index, onDelete) {
  const deleteBtn = document.createElement('button')
  deleteBtn.classList.add('delete-btn')
  deleteBtn.textContent = '🗑️'
  deleteBtn.title = 'Delete message'
  deleteBtn.setAttribute('tabindex', '0')
  deleteBtn.setAttribute('aria-label', 'Delete message')
  deleteBtn.addEventListener('click', () => onDelete(index))
  textContainer.appendChild(deleteBtn)
  deleteBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onDelete(index)
    }
  })

  textContainer.addEventListener('mouseenter', () => {
    deleteBtn.style.display = 'block'
  })
  textContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      deleteBtn.style.display = 'block'
    }
  })
  textContainer.addEventListener('mouseleave', () => {
    deleteBtn.style.display = 'none'
  })
}

/**
 * Creates a time display element for a message.
 *
 * @param {string} timestamp - ISO string of the message tinmestamp.
 * @returns {HTMLElement} The custom date-time-display element for the message.
 */
function createTimeEl (timestamp) {
  const timeEl = document.createElement('date-time-display')
  timeEl.classList.add('message-time')
  timeEl.setAttribute('datetime', timestamp)
  timeEl.setAttribute('format', 'time')
  return timeEl
}

/**
 * Adds a message and re-renders.
 *
 * @param {string} text - The message text to add.
 * @param {Array<object>} messages - The array of messages to update.
 * @param {HTMLElement} messagesList - The container element to render messages in.
 * @param {object} state - The current state object containing username and avatar.
 * @param {WebSocket} socket - WebSocket instance to send the message.
 * @param {object|null} [replyTo=null] - Optional message object that this message is replying to.
 * @returns {void}
 */
export function addMessage (text, messages, messagesList, state, socket, replyTo = null) {
  const trimmed = text.trim()
  if (!trimmed) return

  messages.push({
    from: 'me',
    username: state.username,
    avatar: state.avatar,
    text: trimmed,
    timestamp: new Date().toISOString(),
    replyTo,
    channel: state.channel
  })

  renderMessages(messagesList, messages, (index) => removeMessage(index, messages, messagesList))

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'message',
      data: trimmed,
      username: state.username,
      channel: state.channel,
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
