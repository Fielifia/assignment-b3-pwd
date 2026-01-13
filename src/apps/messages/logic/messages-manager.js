import { sendMessage } from '../services/socket.js'
import { renderMessages } from './messages-renderer.js'
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
export function addMessage (
  text,
  messages,
  messagesList,
  state,
  socket,
  replyTo,
  onReply
) {
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

  renderMessages(messagesList, messages, () => { }, onReply)
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
  renderMessages(messagesList, messages, () => { })
}
