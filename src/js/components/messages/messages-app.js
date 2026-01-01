/**
 * Messages application web component.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @augments HTMLElement
 * @description A custom web component for a simple chat interface with a message thread
 * and an input field with send button. Messages can be deleted individually.
 */

import '../memory/nickname-form/index.js'

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
    justify-content: space-between;
    gap: .5rem;
}

.delete-btn {
    background: none;
    border: none;
}

</style>
<div class="container">
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
   * Creates the shadow DOM and appends the template content.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.username = localStorage.getItem('messagesUsername') || ''
    this.messages = []

    this.messagesList = this.shadowRoot.querySelector('.messages-list')
    this.textarea = this.shadowRoot.querySelector('textarea')
    this.sendBtn = this.shadowRoot.querySelector('.send-btn')
    this.usernameForm = this.shadowRoot.querySelector('nickname-form')
  }

  /**
   * Called when the component is added to the DOM.
   * Initializes UI interactions.
   */
  connectedCallback () {
    this.initUI()
  }

  /**
   * Initializes UI interactions.
   *
   * @returns {void}
   */
  initUI () {
    if (!this.username) {
      this.usernameForm = this.shadowRoot.querySelector('nickname-form')
      this.usernameForm.addEventListener('nickname-submitted', (e) => {
        this.username = e.detail
        localStorage.setItem('messagesUsername', this.username)
        this.usernameForm.remove()
      })
    } else {
      this.usernameForm.remove()
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
   * Adds a new message to the local message list and updates the UI.
   */
  addMessage () {
    const text = this.textarea.value.trim()
    if (!text) return
    const msg = { username: this.username, text }
    this.messages.push(msg)
    this.renderMessages()
    this.textarea.value = ''
  }

  /**
   * Removes a message from the message list.
   *
   * @param {number} index - Index of the message to remove.
   * @returns {void}
   */
  removeMessage (index) {
    this.messages.splice(index, 1)
    this.renderMessages()
  }

  /**
   * Renders all messages in the messages list container.
   * Scrolls to the bottom automatically.
   */
  renderMessages () {
    this.messagesList.innerHTML = ''

    this.messages.forEach((m, index) => {
      const msgEl = document.createElement('div')
      msgEl.classList.add('message')

      const textEl = document.createElement('span')
      textEl.textContent = `${m.username}: ${m.text}`

      const deleteBtn = document.createElement('button')
      deleteBtn.classList.add('delete-btn')
      deleteBtn.textContent = '🗑️'
      deleteBtn.title = 'Delete message'

      deleteBtn.addEventListener('click', () => {
        this.removeMessage(index)
      })
      msgEl.appendChild(textEl)
      if (m.username === this.username) msgEl.appendChild(deleteBtn)
      this.messagesList.appendChild(msgEl)
    })
    this.messagesList.scrollTop = this.messagesList.scrollHeight
  }
}
customElements.define('messages-app', MessagesApp)
