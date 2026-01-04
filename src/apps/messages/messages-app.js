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
import './components/dateTime-display.js'

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
}

avatar-picker {
    margin-top: 1rem;
}

nickname-form {
    margin-bottom: 1rem;
}

.chat-container {
    flex-direction: column;
    min-height: 0;
    flex: 1;
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
    align-items: center;
    display: flex;
    gap: .2rem;
    border-top: 2px solid #00000033;
}

#chat-msg {
    resize: none;
    flex: 1;
    font-size: .9rem;
    border: none;
    min-width: 0;
}

#chat-msg:focus {
    outline: none;
}
button {
    cursor: pointer;
}

.message {
    display: flex;
    border: 2px solid #00000073;
    border-radius: 12px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
    padding: .5rem;
    margin-bottom: .5rem;
    gap: .2rem;
}
div.message.me {
    align-self: flex-end;
    background: #d1f0ff;
}

div.message.them {
    align-self: flex-start;
    background: #f0f0f0;
}

.send-btn {
    background: none;
    border: none;
    font-size: 1rem;
    padding: .5rem;
}

.delete-btn {
    background: none;
    border: none;
    margin-left: 1rem;
}

.avatar-el, .text-el {
    display: flex;
    font-size: .9rem;
    align-items: center;
}
.text-el {
    flex: 1;
    word-break: break-word;
}

date-time-display {
    display: block;
    width: 100%;
    font-size: 1.2rem;
    text-align: right;
}
    
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer">

<div class="container">
<date-time-display datetime="" format="datetime"></date-time-display>
<avatar-picker></avatar-picker>
<nickname-form label-text="Enter you username:" button-text="Join"></nickname-form>
<div class="chat-container" style="display:none;">
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

    this.state = {
      username: localStorage.getItem('messagesUsername') || '',
      avatar: localStorage.getItem('messagesAvatar') || ''
    }

    this.otherUser = {
      username: 'ChatBot',
      avatar: '🤖'
    }

    this.messages = []

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
    })

    if (this.state.username) {
      this.usernameForm.remove()
      this.avatarPicker.remove()
      this.chatContainer.style.display = 'flex'
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
      text
    })

    this.renderMessages()
    this.textarea.value = ''

    this.fakeReply(text)
  }

  /**
   * Simulates a reply from the other user after a short delay.
   *
   * @param {string} text - The message.
   * @returns {void}
   */
  fakeReply (text) {
    setTimeout(() => {
      this.messages.push({
        from: 'them',
        username: this.otherUser.username,
        avatar: this.otherUser.avatar,
        text: `You said: ${text}`
      })

      this.renderMessages()
    }, 800)
  }

  /**
   * Renders all messages in the message list.
   * Scrolls to the latest message automatically.
   *
   * @returns {void}
   */
  renderMessages () {
    this.messagesList.innerHTML = ''

    this.messages.forEach((m, index) => {
      const msgEl = document.createElement('div')
      msgEl.classList.add('message')

      msgEl.classList.add(m.from)

      const avatarEl = document.createElement('span')
      avatarEl.classList.add('avatar-el')
      avatarEl.textContent = m.avatar

      const textEl = document.createElement('span')
      textEl.classList.add('text-el')
      textEl.innerHTML = `<strong>${m.username}:</strong>&nbsp;${m.text}`

      msgEl.appendChild(avatarEl)
      msgEl.appendChild(textEl)

      if (m.from === 'me') {
        const deleteBtn = document.createElement('button')
        deleteBtn.classList.add('delete-btn')
        deleteBtn.textContent = '🗑️'
        deleteBtn.title = 'Delete message'
        deleteBtn.addEventListener('click', () => this.removeMessage(index))
        msgEl.appendChild(deleteBtn)
      }

      this.messagesList.appendChild(msgEl)
    })
    this.messagesList.scrollTop = this.messagesList.scrollHeight
  }

  /**
   * Removes a message a the given index.
   *
   * @param {number} index - Index of the message to remove.
   * @returns {void}
   */
  removeMessage (index) {
    this.messages.splice(index, 1)
    this.renderMessages()
  }
}
customElements.define('messages-app', MessagesApp)
