/**
 * Creates and returns the initial state for the chat application.
 *
 * @returns {object} The initial chat state object.
 */
export function createChatState () {
  return {
    messages: [], // Array to store all messages
    replyTo: null, // Currently selected message to reply to
    username: localStorage.getItem('messagesUsername') || '', // Load saved username from localStorage
    avatar: localStorage.getItem('messagesAvatar') || '', // Load saved avatar from localStorage
    channel: 'default' // Default chat channel
  }
}
