const SOCKET_URL = 'wss://courselab.lnu.se/message-app/socket'
const API_KEY = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

const PING_INTERVAL = 10_000 // 10s
const TIMEOUT = 20_000
/**
 * Initializes a WebSocket and manages incoming messages and connection status.
 *
 * @param {object} state - Component state containing username and avatar.
 * @param {Array<object>} messages - Array where recieved messages are stored.
 * @param {Function} onMessage - Callback triggered when a new message is recieved.
 * @param {Function} onStatusChange - Callback triggered when connection status changes.
 * @returns {WebSocket} The initialized WebSocket instance.
 */
export function initSocket (state, messages, onMessage, onStatusChange) {
  const socket = new WebSocket(SOCKET_URL)

  let lastPong = Date.now()
  let pingInterval

  /**
   * Sends a ping message to keep the connection alive
   * and detect stalled connections.
   *
   * @private
   */
  const sendPing = () => {
    if (socket.readyState !== WebSocket.OPEN) return

    socket.send(JSON.stringify({
      type: 'ping',
      key: API_KEY
    }))
  }

  socket.addEventListener('open', () => {
    console.log('Connected')
    lastPong = Date.now()
    onStatusChange?.('online')

    pingInterval = setInterval(() => {
      sendPing()

      if (Date.now() - lastPong > TIMEOUT) {
        onStatusChange?.('offline')
      }
    }, PING_INTERVAL)
  })

  socket.addEventListener('close', () => {
    console.log('Disconnected')
    clearInterval(pingInterval)
    onStatusChange?.('offline')
  })

  socket.addEventListener('message', (e) => {
    lastPong = Date.now()

    let msg
    try {
      msg = JSON.parse(e.data)
    } catch {
      return
    }

    if (msg.type !== 'message') return
    if (!msg.data?.trim()) return

    const exists = messages.some(m => m.text === msg.data && m.username === msg.username && m.timestamp === msg.timestamp)
    if (exists) return // Ignore duplicate messages

    messages.push({
      from: msg.username === state.username ? 'me' : 'them',
      username: msg.username,
      avatar: msg.username === state.username ? state.avatar : '👤',
      text: msg.data,
      timestamp: msg.timestamp || new Date().toISOString(),
      channel: msg.channel
    })

    onMessage()
  })

  return socket
}

/**
 * Sends a message over an open WebSocket connection.
 *
 * @param {WebSocket} socket - Active WebSocket connection.
 * @param {string} text - The message text to send.
 * @param {object} state - Component state object containing username and channel.
 * @param {string} timestamp - The timestamp of the message.
 */
export function sendMessage (socket, text, state, timestamp) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'message',
      data: text,
      username: state.username,
      channel: state.channel,
      timestamp,
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }))
  }
}
