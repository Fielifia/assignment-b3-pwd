/**
 * Messages application web component.
 *
 * Provides a real-time chat interface connected to a server with:
 * - Username selection
 * - Avatar selection
 * - Reply functionality
 *
 * Handles sending, receiving, and replying to messages.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @augments HTMLElement
 */
import './components/avatar-picker/avatar-picker.js'
import '../../components/date-time-display/dateTime-display.js'
import '../../components/nickname-form/nickname-form.js'

import { addMessage, removeMessage } from './logic/messages-manager.js'
import { renderMessages } from './logic/messages-renderer.js'
import { template } from './messages-app.template.js'
import { initSocket } from './services/socket.js'
import { initUI } from './ui/ui-init.js'
/**
 * MessagesApp class for the chat component.
 *
 * @class
 */
export class MessagesApp extends HTMLElement {
  /** @type {object[]} Array of message objects in the chat */
  #messages = []
  /** @type {object|null} Currently replying to this message */
  #replyTo = null
  /** @type {WebSocket} WebSocket connection */
  #socket
  /** @type {AbortController|null} Controller for removing event listeners on disconnect */
  #abortController

  /**
   * Handles click on cancel reply button.
   *
   * @private
   * @returns {void}
   */
  #handleCancelReply = () => this.clearReply()

  /**
   * Handles toggling of the sidebar visibility.
   *
   * @private
   * @returns {void}
   */
  #handleToggleSidebar = () => {
    const toggleBtn = this.shadowRoot.querySelector('.sidebar-toggle')
    const sidebar = this.shadowRoot.querySelector('.sidebar')
    const container = this.shadowRoot.querySelector('.container')

    const isOpen = sidebar.classList.toggle('visible')
    container.classList.toggle('sidebar-open', isOpen)

    const icon = toggleBtn.querySelector('i')
    icon.classList.add('is-open', isOpen)
    icon.classList.remove('fa-chevron-left', !isOpen)
  }

  /**
   * Renders all messages to the messages list.
   *
   * @private
   * @returns {void}
   */
  #renderMessages = () => {
    renderMessages(
      this.messagesList, this.#messages, (index) => removeMessage(index, this.#messages, this.messagesList), (msg) => this.setReply(msg))
  }

  /**
   * Creates the MessagesApp component.
   * Initializes state, DOM references, (and message storage).
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    /** @type {{username: string, avatar: string}} */
    this.state = {
      username: localStorage.getItem('messagesUsername') || '',
      avatar: localStorage.getItem('messagesAvatar') || ''
    }

    this.dateDisplay = this.shadowRoot.querySelector('date-time-display')
    this.dateDisplay.classList.add('time-display')
    this.chatContainer = this.shadowRoot.querySelector('.chat-container')
    this.messagesList = this.shadowRoot.querySelector('.messages-list')
    this.textarea = this.shadowRoot.querySelector('textarea')
    this.sendBtn = this.shadowRoot.querySelector('.send-btn')
    this.usernameForm = this.shadowRoot.querySelector('nickname-form')
    this.avatarPicker = this.shadowRoot.querySelector('avatar-picker')
    this.replyPreview = this.shadowRoot.querySelector('.reply-preview')
    this.replyText = this.shadowRoot.querySelector('.reply-text')
    this.cancelReplyBtn = this.shadowRoot.querySelector('.cancel-reply-btn')
    this.sidebar = this.shadowRoot.querySelector('.sidebar')
    this.sidebarToggleBtn = this.shadowRoot.querySelector('.sidebar-toggle')
  }

  /**
   * Lifecycle callback when connected to DOM.
   */
  connectedCallback () {
    this.#abortController = new AbortController()
    const signal = this.#abortController.signal

    this.cancelReplyBtn.addEventListener('click', this.#handleCancelReply, { signal })
    this.sidebarToggleBtn.addEventListener('click', this.#handleToggleSidebar, { signal })

    initUI({
      avatarPicker: this.avatarPicker,
      usernameForm: this.usernameForm,
      sidebar: this.sidebar,
      chatContainer: this.chatContainer,
      textarea: this.textarea,
      sendBtn: this.sendBtn
    }, this.state, () => {
      addMessage(
        this.textarea.value,
        this.#messages,
        this.messagesList,
        this.state,
        this.#socket,
        this.#replyTo,
        (msg) => this.setReply(msg)
      )

      this.clearReply()
      this.textarea.value = ''
    })

    this.#socket = initSocket(this.state, this.#messages, this.#renderMessages)
  }

  /**
   * Lifecycle callback when disconnected.
   * */
  disconnectedCallback () {
    this.#abortController.abort()
    this.#socket?.close()
  }

  /**
   * Sets replyTo and shows preview.
   *
   * @param {object} message  - Message object to reply to.
   */
  setReply (message) {
    this.#replyTo = message
    this.replyText.innerHTML = ''
    const strong = document.createElement('strong')
    strong.textContent = `Replying ${message.username}`
    const br = document.createElement('br')
    const span = document.createElement('span')
    span.textContent = message.text.length > 50 ? message.text.slice(0, 50) + '...' : message.text
    this.replyText.append(strong, br, span)
    this.replyPreview.style.display = 'flex'
    this.textarea.setAttribute('aria-describedby', 'reply-preview')
    requestAnimationFrame(() => {
      this.textarea.focus()
    })
  }

  /**
   * Clears replyTo and hides preview.
   */
  clearReply () {
    this.#replyTo = null
    this.replyPreview.style.display = 'none'
    this.replyText.innerHTML = ''
    requestAnimationFrame(() => this.textarea.focus())
  }
}
customElements.define('messages-app', MessagesApp)
