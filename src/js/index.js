/**
 * The main script file of the application.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 1.0.0
 */
import { createWindow } from './components/createWindow.js'
import './components/messages-app.js'

const subApps = [
  { iconId: 'chat-icon', title: 'Chat', type: 'chat' },
  { iconId: 'memory-icon', title: 'Memory', type: 'memory' }
]

subApps.forEach(app => {
  const icon = document.getElementById(app.iconId)
  icon.addEventListener('click', () => {
    const win = createWindow(app.title, app.type)

    if (app.type === 'chat') {
      const messagesAppEl = document.createElement('messages-app')
      win.querySelector('.content').appendChild(messagesAppEl)
    }
  })
})
