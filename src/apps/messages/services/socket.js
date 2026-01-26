/**
 * Initializes a WebSocket and handles incoming messages.
 *
 * @param {object} state - Component state.
 * @param {Array<object>} messages - Array to store messages.
 * @param {Function} onMessage - Callback to render/update messages.
 * @param {Function} onHeartbeat - Callback for heartbeat events.
 * @returns {WebSocket} The initialized WebSocket instance.
 */
export function initSocket (state, messages, onMessage, onHeartbeat) {
  const socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')

  // Connection opened
  socket.addEventListener('open', () => console.log('Connected'))
  // Connection closed
  socket.addEventListener('close', () => console.log('Disconnected'))

  // Listen for incoming messages
  socket.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data) // Parse the JSON string

    if (msg.type === 'heartbeat') {
      onHeartbeat?.()
      return
    }

    // Only handle messages from others and non-epmty text
    if (msg.username !== state.username && msg.data?.trim()) {
      messages.push({
        from: 'them', // Marks this message as coming from someone else
        username: msg.username,
        avatar: '👤', // Default avatar for others
        text: msg.data,
        timestamp: new Date().toISOString(),
        channel: msg.channel
      })
      onMessage() // Trigger re-render
    }
  })
  return socket
}

/**
 * Sends a message over the WebSocket.
 *
 * @param {WebSocket} socket - The WebSocket instance to send the message through.
 * @param {string} text - The message text to send.
 * @param {object} state - Component state object containing username and channel.
 */
export function sendMessage (socket, text, state) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'message',
      data: text,
      username: state.username,
      channel: state.channel,
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }))
  }
}
