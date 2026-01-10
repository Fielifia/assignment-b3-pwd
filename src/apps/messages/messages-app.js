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
    padding: 1rem 0;
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

#chat-msg:focus {
    outline: none;
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
}

.message.me .message-text-container {
    margin-left: auto;
    background: #5f86a12a;
    border-radius: 1rem 1rem .2rem 1rem;
}

.message.them .message-text-container {
    margin-right: auto;
    background: #8fb3cc2a;
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
    bottom: -1.5rem;
    right: -.5rem;
    display: none;
    background: none;
    border: none;
    font-size: .8rem;
    cursor: pointer;
    z-index: 10;
}

.time-display {
    display: block;
    padding: .5rem;
    background: linear-gradient(145deg, #3f5f73, #5f86a1);
    color: #000;
    text-align: right;
    box-shadow: inset 0 -1px 0 rgba(0,0,0,0.1);
}
    
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer">

<date-time-display datetime="" format="datetime" show-seconds></date-time-display>
<div class="container">
<avatar-picker></avatar-picker>
<nickname-form label-text="Enter you username:" button-text="Join"></nickname-form>
<div class="chat-container">
<div class="messages-list"></div>

<div class="send-msg">
<textarea id="chat-msg" placeholder="Write a message"></textarea>
<button class="send-btn"><i class="fa-solid fa-paper-plane"></i></button>
</div>
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
