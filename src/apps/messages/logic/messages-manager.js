import { sendMessage } from '../services/socket.js'
import { renderMessages } from './messages-renderer.js'
/**
 * Adds a message to the chat and re-renders the messages list.
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
  if (!trimmed) return // Don't add empty messages

  // Add message to the local array
  messages.push({
    from: 'me',
    username: state.username,
    avatar: state.avatar,
    text: trimmed,
    timestamp: new Date().toISOString(),
    replyTo,
    channel: state.channel
  })
  // Re-renders messages in the DOM
  renderMessages(messagesList, messages, () => { }, onReply)
  // Send the message trough WebSocket to the server
  sendMessage(socket, trimmed, state)
}

/**
 * Removes a message at the given index and re-renders the messages.
 *
 * @param {number} index - Index of the message to remove.
 * @param {Array<object>} messages - The array of messages to update.
 * @param {HTMLElement} messagesList - The container element to render messages in.
 * @returns {void}
 */
export function removeMessage (index, messages, messagesList) {
  messages.splice(index, 1) // Remove message from local array
  renderMessages(messagesList, messages, () => { })
}
