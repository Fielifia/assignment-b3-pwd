/**
 * Initializes a WebSocket and handles incoming messages.
 *
 * @param {WebSocket} socket - Websocket instance.
 * @param {object} state - Component state.
 * @param {Array<object>} messages - Array to store messages.
 * @param {Function} onMessage - Callback to render/update messages.
 */
export function initSocket (socket, state, messages, onMessage) {
  socket.addEventListener('open', () => console.log('Connected'))
  socket.addEventListener('close', () => console.log('Disconnected'))

  socket.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data)

    if (msg.username !== state.username && msg.data?.trim()) {
      messages.push({
        from: 'them',
        username: msg.username,
        avatar: '👤',
        text: msg.data,
        timestamp: new Date().toISOString()
      })
      onMessage()
    }
  })
}
