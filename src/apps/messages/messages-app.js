/**
 * Messages application web component.
 *
 * Provides a real-time chat interface connected to a server with:
 * - Username selection
 * - Avatar selection
 * - Channel selection
 * - Reply functionality
 *
 * Handles sending, receiving, and replying to messages.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @augments HTMLElement
 */
import '../../components/avatar-picker.js'
import '../../components/channel-picker.js'
import '../../components/dateTime-display.js'
import '../../components/nickname-form.js'
/// ///////////////////
import { addMessage, removeMessage } from './logic/messages-manager.js'
import { addSystemMessage, renderMessages } from './logic/messages-renderer.js'
import { template } from './messages-app.template.js'
import { initSocket } from './services/socket.js'
import { initUI } from './ui/ui-init.js'
/**
 * MessagesApp class for the chat component.
 *
 * @class
 */
export class MessagesApp extends HTMLElement {
  /** @private */ #messages = []
  /** @private */ #replyTo = null
  /** @private */ #socket = null

  /**
   * Creates the MessagesApp component.
   * Initializes state, DOM references, (and message storage).
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    /** @type {{username: string, avatar: string, channel: string}} */
    this.state = {
      username: localStorage.getItem('messagesUsername') || '',
      avatar: localStorage.getItem('messagesAvatar') || '',
      channel: 'default'
    }

    // DOM references
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
    this.picker = this.shadowRoot.querySelector('channel-picker')

    this.#handleCancelReply = this.#handleCancelReply.bind(this)
    this.#handleChannelChange = this.#handleChannelChange.bind(this)
    this.#bindEvents()
  }

  /**
   * Handles click on cancel reply button.
   *
   * @private
   */
  #handleCancelReply = () => {
    this.clearReply()
  }

  /**
   * Handles channel-picker change event.
   *
   * @param {CustomEvent<string>} e - Event containing selected channel in e-detail.
   */
  #handleChannelChange = (e) => {
    const newChannel = e.detail
    if (newChannel === this.state.channel) return

    this.state.channel = newChannel

    addSystemMessage(this.#messages, newChannel, `Welcome to the channel: ${newChannel}!`)

    renderMessages(
      this.messagesList,
      this.#messages.filter(m => m.channel === this.state.channel),
      (index) => removeMessage(index, this.#messages, this.messagesList),
      (msg) => this.setReply(msg)
    )
  }

  /**
   * Binds event listeners for reply and channel picker.
   */
  #bindEvents () {
    this.cancelReplyBtn.addEventListener('click', this.#handleCancelReply)
    this.picker.addEventListener('channel-change', this.#handleChannelChange)
  }

  /**
   * Lifecycle callback when connected to DOM.
   * */
  connectedCallback () {
    this.picker.value = this.state.channel
    initUI({
      avatarPicker: this.avatarPicker,
      usernameForm: this.usernameForm,
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

    this.#socket = initSocket(this.state, this.#messages, () => renderMessages(this.messagesList, this.#messages, (index) => removeMessage(index, this.#messages, this.messagesList), (msg) => this.setReply(msg)))
  }

  /**
   * Lifecycle callback when disconnected.
   * */
  disconnectedCallback () {
    this.cancelReplyBtn.removeEventListener('click', this.#handleCancelReply)
    this.picker.removeEventListener('channel-change', this.#handleChannelChange)
  }

  /**
   * Sets replyTo and shows preview.
   *
   * @param {object} message  - Message object to reply to.
   */
  setReply (message) {
    this.#replyTo = message
    this.replyText.innerHTML = `<strong>Replying ${message.username}</strong><br> ${message.text}`
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
    requestAnimationFrame(() => {
      this.textarea.focus()
    })
  }
}
customElements.define('messages-app', MessagesApp)
