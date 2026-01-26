/**
 * Entry point for the Progressive Web Desktop application.
 * Registers the shell and sets up Service Worker for offline support.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 1.0.0
 */

import { PwdShell } from './shell/pwd-shell.js'
// Instantiate the shell
// This initializes the main UI and handles routing within the PWD
/* eslint-disable-next-line no-new */
new PwdShell()

// Register Service Worker for offline capabilities and caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      // Attempt to register service worker
      const registration = await navigator.serviceWorker.register('/serviceworker.js')
      console.log('ServiceWorker: Registration successfull with scope: ', registration.scope)
    } catch (error) {
      // Log any errors if registration fails
      console.error('ServiceWorker: Registration failed: ', error)
    }
  })
}
