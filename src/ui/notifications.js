/**
 * Request permission from the user to show desktop notifications.
 *
 * Checks if the Notification API is available, and if permission
 * is 'default', it will prompt the user to allow notifications.
 *
 * @async
 * @returns {Promise<void>} Resolves when the permission request is completed.
 */
export async function requestNotificationPermission () {
  if (!('Notification' in window)) {
    return console.warn('Notifications not supported')
  }

  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }
}
/**
 * Shows a desktop notification to the user if permission is granted.
 *
 * If permission is not yet granted, or denied, it will request permission
 * before showing the notification. The notification includes title, body,
 * and a default icon.
 *
 * @param {string} [title = 'PWD Message'] - The title of the notification.
 * @param {string} [body='You have a new message!'] - The body text of the notification.
 * @returns {void}
 */
export function showNotification (title = 'PWD Message', body = 'You have a new message!') {
  if (!('Notification' in window)) return

  if (Notification.permission === 'granted') {
    // eslint-disable-next-line no-new
    new Notification(title, { body, icon: '💬' })
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        // eslint-disable-next-line no-new
        new Notification(title, { body, icon: '💬' })
      }
    })
  }
}
