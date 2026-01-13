/**
 * Creates and returns the initial state for the chat application.
 *
 * @returns {object} The initial chat state object.
 */
export function createChatState () {
  return {
    messages: [],
    replyTo: null,
    username: localStorage.getItem('messagesUsername') || '',
    avatar: localStorage.getItem('messagesAvatar') || '',
    channel: 'default'
  }
}
