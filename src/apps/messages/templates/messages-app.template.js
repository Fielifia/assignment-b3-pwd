export const template = document.createElement('template')
template.innerHTML = `
<style>
* {
    font-family: 'Montserrat', Arial, Helvetica, sans-serif;
}

:host {
    background: #edf2f7;
}

.container {
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;
    padding: .5rem;
    transition: margin-left .3s ease;
}

.container.sidebar-open {
    margin-left: 7rem;
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

.sidebar {
    position: absolute;
    display: flex;
    transform: translateX(-110%);
    flex-direction: column;
    background: linear-gradient(135deg, #aec9dd 20%, #b7cfe154);
    border: 1px solid #aec9dd;
    padding: 1rem .5rem;
    height: 100%;
    width: 6rem;
    gap: 0;
    transition: transform .3s ease;
    z-index: 10;
}

.sidebar.visible {
    transform: translateX(0);
}

.sidebar-toggle {
    position: absolute;
    top: 3.4rem;
    left: .6rem;
    z-index: 20;
    display: flex;
    background: #5f86a1;
    border: none;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    padding: .2rem;
    height: 1.5rem;
    width: 1.5rem;
    align-items: center;
    justify-content: center;
    transition: transform .2s ease, background .2s ease;
}
   .sidebar-toggle:focus-visible {
  outline: 2px solid #5f86a1;
  transform: translateX(.2rem);
}

.sidebar.visible + .sidebar-toggle {
    transform: translateX(7rem);
}

div.sidebar-toggle i.fas.fa-chevron-right.is-open.true {
    transform: rotate(180deg);
}

div.sidebar.visible nickname-form..in-sidebar {
  width: 6rem;
  font-size: .5rem;
}

.messages-list  {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    padding: 0 .5rem;
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
    max-height: 150px;
    background: none;
    resize: none;
    font-size: .9rem;
    border: none;
    min-height: 40px;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: #5f86a1 #cbdde8;
}

#chat-msg::--webkit-scrollbar {
    width: 6px;
}
#chat-msg::--webkit-scrollbar-thumb {
    background: #5f86a1;
    border-radius: 3px;
    border: 1px solid #3f5f73;
}

#chat-msg::--webkit-scrollbar-thumb:hover {
    background: #3f5f73;
}

#chat-msg::--webkit-scrollbar-track {
    background: #cbdde8;
    border-radius: 3px;
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
    border: 1px solid #cbdde8;
    border-radius: 1rem 1rem 1rem .2rem;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
    padding: .2rem .5rem;
    max-width: 70%;
    transition: transform .3s ease;
}

.message.me .message-text-container:hover, .message-text-container:focus-visible {
    transform: scale(1.02) translateX(-.2rem);
}

.message.them .message-text-container:hover, .message-text-container:focus-visible {
    transform: scale(1.02) translateX(.2rem);
}

.message.me .message-text-container {
    margin-left: auto;
    background: linear-gradient(135deg, #aec9dd, #b7cfe1);
    border-radius: 1rem 1rem .2rem 1rem;
    border: 1px solid #aec9dd;
}

.message.them .message-text-container {
    margin-right: auto;
    background: linear-gradient(135deg, #cbdde8, #d5e5ee);
    cursor: pointer;
}

.message.system .message-text-container {
    margin-right: auto;
    background: linear-gradient(135deg, #b8d0e2, #c6e0ec);
    cursor: default;
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
    color: #3f5f73;
    font-size: 1rem;
    padding: .5rem;
    cursor: pointer;
    transition: transform .2s ease;
}

.send-btn:hover, .send-btn:focus-visible {
    transform: scale(1.1);
    color: #5f86a1;
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

textarea:focus, button:focus {
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
<div class="sidebar">
</div>
<button class="sidebar-toggle">
<i class="fas fa-chevron-right"></i>
</button>
<div class="container">
<avatar-picker></avatar-picker>
<nickname-form label-text="Enter username:" button-text="Join"></nickname-form>
<div class="chat-container">
<div class="messages-list"></div>

<div class="reply-preview">
<span class="reply-text"></span>
<span class="cancel-reply-btn">✖</span>
</div>

<div class="send-msg">
<textarea id="chat-msg" placeholder="Write a message"></textarea>
<button class="send-btn"><i class="fa-solid fa-paper-plane"></i></button>
</div>
</div>
</div>
`
