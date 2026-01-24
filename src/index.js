/**
 * Entry point for the Progressive Web Desktop application.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 1.0.0
 */

import { PwdShell } from './shell/pwd-shell.js'
/* eslint-disable-next-line no-new */
new PwdShell()

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/serviceworker.js')
      console.log('ServiceWorker: Registration successfull with scope: ', registration.scope)
    } catch (error) {
      console.error('ServiceWorker: Registration failed: ', error)
    }
  })
}
