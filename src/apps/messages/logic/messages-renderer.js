import { createMessageElement } from '../ui/messages-element.js'
/**
 * Renders all messages in the message list.
 * Scrolls to the latest message automatically.
 *
 * @param {HTMLElement} messagesList - The container element where messages will be rendered.
 * @param {Array<object>} messages - Array of messages object to render.
 * @param {Function} onDelete - Callback function to remove message by index.
 * @param {Function} [onReply] - Optional callback function when replying to a message.
 * @returns {void}
 */
export function renderMessages (messagesList, messages, onDelete, onReply) {
  messagesList.innerHTML = ''
  messages.forEach((m, i) => {
    messagesList.appendChild(createMessageElement(m, i, onDelete, onReply))
  })
  messagesList.scrollTop = messagesList.scrollHeight
}

/**
 * Adds a system message to the messages array.
 *
 * @param {Array<object>} messages - The array of message objects.
 * @param {string} channel - The channel the message belongs to.
 * @param {string} text - The text content of the message.
 * @returns {void}
 */
export function addSystemMessage (messages, channel, text) {
  messages.push({
    from: 'system',
    username: 'System',
    avatar: '💻',
    text,
    channel,
    timestamp: new Date().toISOString()
  })
}
