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
import { renderMessages, addMessage, removeMessage } from './modules/messages-handler.js'
import { initSocket } from './modules/socket-init.js'
import { initUI } from './modules/ui-init.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
* {
    font-family: 'Montserrat', Arial, Helvetica, sans-serif;
}

.container {
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;
    padding: 1rem 1rem 0;
    background: #8fb3cc2a;
}

avatar-picker {
    margin-top: 1rem;
}
nickname-form {
    margin-bottom: 1rem;
}

.chat-container {
    display: none;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.messages-list  {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}
    
.send-msg {
    display: flex;
    align-items: center;
    gap: .2rem;
    border-top: 2px solid #00000033;
}

#chat-msg {
    flex: 1;
    min-width: 0;
    background: none;
    resize: none;
    font-size: .9rem;
    border: none;
}

button {
    cursor: pointer;

}

.message {
    display: flex;
    flex-direction: column;
}

.message-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: .5rem;
    width: 100%;
}

.message-body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0;
}

.message.me .message-body {
    align-items: flex-end;
}

.message.me .message-content {
    flex-direction: row-reverse;
}

.message-text-container {
    position: relative;
    border: 1px solid #00000033;
    border-radius: 1rem 1rem 1rem .2rem;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
    padding: .2rem .5rem;
    max-width: 80%;
    transition: transform .3s ease;
}

.message.me .message-text-container:hover {
    transform: scale(1.02) translateX(-.2rem);
}

.message.me .message-text-container {
    margin-left: auto;
    background: #5f86a1;
    border-radius: 1rem 1rem .2rem 1rem;
}

.message.them .message-text-container {
    margin-right: auto;
    background: #8fb3cc2a;
    cursor: pointer;
}

.avatar-el {
    flex-shrink: 0;
    font-size: 1rem;
    align-self: flex-end;
}

.username-el {
    display: flex;
    font-size: .7rem;
    color: #555;
    white-space: nowrap;
    margin: 2px .5rem;
}

.message.me .username-el {
    text-align: right;
}

.text-el {
    word-break: break-word;
    margin-top: 2px;
}

.message-time {
    display: block;
    font-size: .6rem;
    margin: 2px 0 1rem 0;
    color: #555;
    width: 100%;
    text-align: center;
}

.send-btn {
    background: none;
    border: none;
    font-size: 1rem;
    padding: .5rem;
}

.delete-btn {
    position: absolute;
    bottom: -.6rem;
    right: -.8rem;
    display: none;
    background: none;
    border: none;
    font-size: .8rem;
    cursor: pointer;
    z-index: 10;
}

textarea:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid #5f86a1;
}

.time-display {
    display: block;
    padding: .5rem;
    background: linear-gradient(145deg, #3f5f73, #5f86a1);
    color: #000;
    text-align: right;
    box-shadow: inset 0 -1px 0 rgba(0,0,0,0.1);
}

.reply-preview {
  display: none;
  padding: .2rem .5rem;
  border-left: 3px solid #555;
  background: #d9e3f0;
  margin-bottom: .2rem;
  font-size: .8rem;
  position: relative;
}

.reply-text {
  font-size: .6rem;
}

.cancel-reply-btn {
  position: absolute;
  top: 0;
  right: .5rem;
  cursor: pointer;
}

#reply-arrow {
    font-size: .4rem;
    margin: .3rem .3rem 0 0;
}

.reply-user {
    background: #8fb3cc2a;
    font-size: .6rem;
    border: 1px solid #00000033;
    border-radius: 1rem 1rem 1rem .2rem;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
    padding: .2rem .5rem 1rem;
    max-width: 100%;
    transition: transform .3s ease;
    pointer-events: none;
}
    
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer">

<date-time-display datetime="" format="datetime" show-seconds></date-time-display>
<div class="container">
<avatar-picker></avatar-picker>
<nickname-form label-text="Enter you username:" button-text="Join"></nickname-form>
<div class="chat-container">
<div class="messages-list"></div>

<div class="reply-preview" style="display: none;">
<span class="reply-text"></span>
<span class="cancel-reply-btn">✖</span>
</div>

<div class="send-msg">
<textarea id="chat-msg" placeholder="Write a message"></textarea>
<button class="send-btn"><i class="fa-solid fa-paper-plane"></i></button>
</div>
</div>
<div class="channel-select">
<select id="channel">
<option value="" selected disabled>Select channel</option>
<option value="general">General</option>
<option value="myChannel">My Channel</option>
<option value="random">Random</option>
</select>
</div>
</div>
`
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

    this.state = {
      username: localStorage.getItem('messagesUsername') || '',
      avatar: localStorage.getItem('messagesAvatar') || '',
      channel: 'general'
    }
    this.messages = []
    this.replyTo = null

    this.dateDisplay = this.shadowRoot.querySelector('date-time-display')
    this.dateDisplay.classList.add('time-display')
    this.chatContainer = this.shadowRoot.querySelector('.chat-container')
    this.messagesList = this.shadowRoot.querySelector('.messages-list')
    this.textarea = this.shadowRoot.querySelector('textarea')
    this.sendBtn = this.shadowRoot.querySelector('.send-btn')
    this.usernameForm = this.shadowRoot.querySelector('nickname-form')
    this.avatarPicker = this.shadowRoot.querySelector('avatar-picker')
    this.channelSelect = this.shadowRoot.querySelector('#channel')

    this.channelSelect.value = this.state.channel
  }

  /**
   * Lifecycle callback.
   * Initializes UI logic and event listeners.
   */
  connectedCallback () {
    this.channelSelect.addEventListener('change', (e) => {
      this.state.channel = e.target.value
      console.log('Channel changed to: ', this.state.channel)
      this.clearReply()
      renderMessages(
        this.messagesList, this.messages.filter(m => m.channel === this.state.channel), (index) => removeMessage(index, this.messages, this.messagesList), (msg) => this.setReply(msg)
      )
    })
    this.replyPreview = this.shadowRoot.querySelector('.reply-preview')
    this.replyText = this.shadowRoot.querySelector('.reply-text')
    this.cancelReplyBtn = this.shadowRoot.querySelector('.cancel-reply-btn')

    this.cancelReplyBtn.addEventListener('click', () => this.clearReply())

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
        this.socket,
        this.replyTo
      )
      this.clearReply()
      this.textarea.value = ''

      renderMessages(
        this.messagesList, this.messages.filter(m => m.channel === this.state.channel), (index) => removeMessage(index, this.messages, this.messagesList), (msg) => this.setReply(msg)
      )

      requestAnimationFrame(() => this.textarea.focus())
    })

    this.socket = initSocket(this.state, this.messages, () => renderMessages(this.messagesList, this.messages, (index) => removeMessage(index, this.messages, this.messagesList), (msg) => this.setReply(msg)))
  }

  /**
   * Sets replyTo and shows preview.
   *
   * @param {object} message  - Message to answer.
   */
  setReply (message) {
    this.replyTo = message
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
    this.replyTo = null
    this.replyPreview.style.display = 'none'
    this.replyText.innerHTML = ''
  }
}
customElements.define('messages-app', MessagesApp)
