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
  messagesList.replaceChildren(
    ...messages.map((message, index) =>
      createMessageElement(message, index, onDelete, onReply)
    )
  )
  // Scroll to the bottom so latest message is visible
  messagesList.scrollTop = messagesList.scrollHeight
}
