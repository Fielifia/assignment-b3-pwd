/**
 * Messages application web component.
 *
 * Provides a simple chat intereface with:
 * - Username selection
 * - Avatar selection
 * - Simulated two-way conversation
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @augments HTMLElement
 */
import '../../components/nickname-form.js'
import './components/avatar-picker.js'
import '../../components/dateTime-display.js'
import template from './components/messages-template.js'
import { renderMessages } from './components/messages-renderer.js'

/**
 * MessagesApp class for the chat component.
 */
export class MessagesApp extends HTMLElement {
  /**
   * Creates the MessagesApp component.
   * Initializes state, DOM references, (and message storage).
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')
    this.state = {
      username: localStorage.getItem('messagesUsername') || '',
      avatar: localStorage.getItem('messagesAvatar') || ''
    }
    this.messages = []

    this.dateDisplay = this.shadowRoot.querySelector('date-time-display')
    this.dateDisplay.classList.add('time-display')
    this.chatContainer = this.shadowRoot.querySelector('.chat-container')
    this.messagesList = this.shadowRoot.querySelector('.messages-list')
    this.textarea = this.shadowRoot.querySelector('textarea')
    this.sendBtn = this.shadowRoot.querySelector('.send-btn')
    this.usernameForm = this.shadowRoot.querySelector('nickname-form')
    this.avatarPicker = this.shadowRoot.querySelector('avatar-picker')
  }

  /**
   * Lifecycle callback.
   * Initializes UI logic and event listeners.
   */
  connectedCallback () {
    this.initUI()
    this.socket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data)

      if (msg.username !== this.state.username && msg.data?.trim()) {
        this.messages.push({
          from: 'them',
          username: msg.username,
          avatar: '👤',
          text: msg.data,
          timestamp: new Date().toISOString()
        })
        renderMessages(this.messagesList, this.messages, this.removeMessage.bind(this))
      }
    })

    this.socket.addEventListener('open', () => console.log('Connected'))
    this.socket.addEventListener('close', () => console.log('Disconnected'))

    document.addEventListener('click', (e) => {
      this.shadowRoot.querySelectorAll('.delete-btn').forEach(btn => {
        if (!btn.parentElement.contains(e.target)) btn.style.display = 'none'
      })
    })
  }

  /**
   * Sets up event listeners and handles initial state.
   *
   * @returns {void}
   */
  initUI () {
    this.avatarPicker.addEventListener('avatar-selected', (e) => {
      this.state.avatar = e.detail.avatar
      localStorage.setItem('messagesAvatar', this.state.avatar)
    })

    this.usernameForm.addEventListener('nickname-submitted', (e) => {
      this.state.username = e.detail
      localStorage.setItem('messagesUsername', this.state.username)
      this.usernameForm.remove()
      this.avatarPicker.remove()
      this.chatContainer.style.display = 'flex'
      this.textarea.focus()
    })

    if (this.state.username) {
      this.usernameForm.remove()
      this.avatarPicker.remove()
      this.chatContainer.style.display = 'flex'
      this.textarea.focus()
    }

    this.sendBtn.addEventListener('click', () => this.addMessage())
    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.addMessage()
      }
    })
  }

  /**
   * Adds a message from the current user.
   *
   * @returns {void}
   */
  addMessage () {
    const text = this.textarea.value.trim()
    if (!text) return

    this.messages.push({
      from: 'me',
      username: this.state.username,
      avatar: this.state.avatar,
      text,
      timestamp: new Date().toISOString()
    })

    renderMessages(this.messagesList, this.messages, this.removeMessage.bind(this))
    this.textarea.value = ''

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'message',
        data: text,
        username: this.state.username,
        channel: 'myChannel',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }))
    }
  }

  /**
   * Removes a message a the given index.
   *
   * @param {number} index - Index of the message to remove.
   * @returns {void}
   */
  removeMessage (index) {
    this.messages.splice(index, 1)
    renderMessages(this.messagesList, this.messages, this.removeMessage.bind(this))
  }
}
customElements.define('messages-app', MessagesApp)
