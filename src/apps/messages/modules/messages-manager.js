import { sendMessage } from './socket-service.js'
import { createMessageElement } from './messages-renderer.js'
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
 * Adds a message and re-renders.
 *
 * @param {string} text - The message text to add.
 * @param {Array<object>} messages - The array of messages to update.
 * @param {HTMLElement} messagesList - The container element to render messages in.
 * @param {object} state - The current state object containing username and avatar.
 * @param {WebSocket} socket - WebSocket instance to send the message.
 * @param {object|null} [replyTo=null] - Optional message object that this message is replying to.
 * @param {(message: object) => void} onReply - Callback invoked when replying to a message.
 * @returns {void}
 */
export function addMessage (text, messages, messagesList, state, socket, replyTo = null, onReply) {
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

  renderMessages(messagesList, messages, (index) => removeMessage(index, messages, messagesList, onReply))
  sendMessage(socket, trimmed, state)
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
