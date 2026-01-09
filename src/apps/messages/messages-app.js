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
import template from './components/messages-template.js'
import '../../components/nickname-form.js'
import './components/avatar-picker.js'
import '../../components/dateTime-display.js'
import { renderMessages, addMessage, removeMessage } from './components/messages-handler.js'
import { initSocket } from './components/socket-init.js'
import { initUI } from './components/ui-init.js'

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
    initUI({
      avatarPicker: this.avatarPicker,
      usernameForm: this.usernameForm,
      chatContainer: this.chatContainer,
      textarea: this.textarea,
      sendBtn: this.sendBtn
    }, this.state, () => {
      addMessage(
        this.textarea.value,
        this.messages,
        this.messagesList,
        this.state,
        this.socket)
      this.textarea.value = ''
      requestAnimationFrame(() => this.textarea.focus())
    })

    initSocket(this.socket, this.state, this.messages, () => renderMessages(this.messagesList, this.messages, removeMessage.bind(initSocket, this.messages, this.messagesList)))

    document.addEventListener('click', (e) => {
      this.shadowRoot.querySelectorAll('.delete-btn').forEach(btn => {
        if (!btn.parentElement.contains(e.target)) btn.style.display = 'none'
      })
    })
  }
}
customElements.define('messages-app', MessagesApp)
