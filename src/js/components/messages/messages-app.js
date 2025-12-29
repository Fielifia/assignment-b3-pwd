/**
 * Messages application web component.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @augments HTMLElement
 * @description A custom web component for a simple chat interface with a message thread
 * and an input field with send button. Messages can be deleted individually.
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
display: block;
height: 100%;
width: 100%;
}

.container {
display: flex;
flex-direction: column;
height: 100%;
}

.chat-thread {
    flex: 1;
    overflow-y: auto;
    width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
}

.chat-thread li {
display: flex;
justify-content: space-between;
gap: .5rem;
}

.send-msg {
    display: flex;
    gap: .2rem;
}

.send-msg input {
    flex: 1;
}

.send-msg button {
    flex-shrink: 0;
}

</style>
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer">
 <div class="container">
<ul class="chat-thread"></ul>
<div class="send-msg">
<input type="text" placeholder="Write your message">
<button id="sendBtn">
<i class="fa-solid fa-paper-plane"></i>
</button>
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
  }

  /**
   * Called when the element is inserted into the DOM.
   * Initializes DOM references and attaches event listeners.
   */
  connectedCallback () {
    this.thread = this.shadowRoot.querySelector('.chat-thread')
    this.input = this.shadowRoot.querySelector('input')
    this.sendBtn = this.shadowRoot.querySelector('#sendBtn')

    this.sendBtn.addEventListener('click', () => this.#sendMessage())
  }

  /**
   * Creates a new message in the thread and adds a delete button.
   *
   * @private
   */
  #sendMessage () {
    const text = this.input.value.trim()
    if (!text) return

    const li = document.createElement('li')
    li.textContent = text

    const deleteBtn = document.createElement('button')
    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('fa-solid', 'fa-trash')
    deleteBtn.appendChild(deleteIcon)

    deleteBtn.addEventListener('click', () => {
      this.thread.removeChild(li)
    })

    li.appendChild(deleteBtn)
    this.thread.appendChild(li)
    this.input.value = ''
  }
}

customElements.define('messages-app', MessagesApp)
