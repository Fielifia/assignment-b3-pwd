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
  let socket
  let lastPong = Date.now()
  let pingInterval = null
  let reconnectTimeout = null
  let manualClose = false

  /**
   * Creates and connects a new WebSocket, sets up event listeners.
   */
  const connect = () => {
    socket = new WebSocket(SOCKET_URL)

    socket.addEventListener('open', () => {
      console.log('Connected')
      lastPong = Date.now()
      onStatusChange?.('online')

      pingInterval = setInterval(() => {
        if (socket.readyState !== WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping', key: API_KEY }))
        }

        if (Date.now() - lastPong > TIMEOUT) {
          console.log('Connection timed out')
          onStatusChange?.('offline')
          socket.close()
        }
      }, PING_INTERVAL)
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

      onMessage?.()
    })

    socket.addEventListener('close', () => {
      console.log('Disconnected')
      clearInterval(pingInterval)
      pingInterval = null
      onStatusChange?.('offline')

      if (!manualClose) {
        reconnectTimeout = setTimeout(() => {
          console.log('Reconnecting...')
          connect()
        }, 2000)
      }
    })

    socket.addEventListener('error', (err) => {
      console.error('Socket error:', err)
      socket.close()
    })
  }

  connect()

  return {
    /**
     * Returns the current WebSocket instance.
     *
     * @returns {WebSocket} The current WebSocket instance.
     */
    getSocket: () => socket,
    /**
     * Closes the WebSocket connection and stops reconnection attempts.
     * Clears all related intervals and timeouts.
     */
    close: () => {
      manualClose = true
      clearInterval(pingInterval)
      clearTimeout(reconnectTimeout)
      socket.close()
    }
  }
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
