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

import '../nickname-form/index.js'
import './avatar.js'

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
    padding: 1rem;
}

.messages-list  {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    padding: 1rem 0;
    }
    
    .send-msg {
    margin-top: auto;
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
    align-items: center;
}

.message me {
    align-self: flex-end;
    background: #d1f0ff;
}

.message them {
    align-self: flex-start;
    background: #f0f0f0;
}

.delete-btn {
    background: none;
    border: none;
}

.avatar-el {
    display: flex;
    font-size: 1.4rem;
}
.text-el {
    display: flex;
    flex: 1;
    word-break: break-word;
}
    
</style>
<div class="container">
<avatar-picker></avatar-picker>
<nickname-form label-text="Enter you username:" button-text="Join"></nickname-form>

<div class="messages-list"></div>

<div class="send-msg">
<textarea id="chat-msg" placeholder="Write a message"></textarea>
<button class="send-btn">Send</button>
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
    })

    if (this.state.username) {
      this.usernameForm.remove()
      this.avatarPicker.remove()
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
      textEl.textContent = `${m.username}: ${m.text}`

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
