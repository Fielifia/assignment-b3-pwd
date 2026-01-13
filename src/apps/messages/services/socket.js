/**
 * Initializes a WebSocket and handles incoming messages.
 *
 * @param {object} state - Component state.
 * @param {Array<object>} messages - Array to store messages.
 * @param {Function} onMessage - Callback to render/update messages.
 * @returns {WebSocket} The initialized WebSocket instance.
 */
export function initSocket (state, messages, onMessage) {
  const socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')

  socket.addEventListener('open', () => console.log('Connected'))
  socket.addEventListener('close', () => console.log('Disconnected'))

  socket.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data)
    if (msg.type === 'heartbeat') return

    if (msg.username !== state.username && msg.data?.trim()) {
      messages.push({
        from: 'them',
        username: msg.username,
        avatar: '👤',
        text: msg.data,
        timestamp: new Date().toISOString(),
        channel: msg.channel
      })
      onMessage()
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
