/**
 * Supported application type identifiers
 *
 * @readonly
 * @param {string}
 */
export const APP_TYPES = {
  CHAT: 'chat',
  MEMORY: 'memory',
  MOOD_TRACKER: 'moodTracker'
}

/**
 * Maps application types to their custom element tags.
 *
 * Used by WindowManager to know which HTML element to create for each app.
 *
 * @readonly
 * @type {{[key: string]: string}}
 */
export const APP_TAGS = {
  chat: 'messages-app',
  memory: 'memory-app',
  moodTracker: 'mood-tracker-app'
}

/**
 * Lazy loaders for application modules.
 *
 * Dynamically imports the module that defines the corresponding custom element.
 * This allows apps to be loaded only when needed.
 *
 * @readonly
 * @type {{[key: string]: function(): Promise<any>}}
 */
export const APP_LOADERS = {
  /**
   * Loads the Messages application module.
   *
   * @returns {Promise<any>} The loaded module.
   */
  chat: () => import('../apps/messages/messages-app.js'),
  /**
   * Loads the Memory game application module.
   *
   * @returns {Promise<any>} The loaded module.
   */
  memory: () => import('../apps/memory/memory-app.js'),
  /**
   * Loads the Mood Tracker application module.
   *
   * @returns {Promise<any>} The loaded module.
   */
  moodTracker: () => import('../apps/mood-tracker/mood-tracker-app.js')

}

/**
 * Pixel offset used to stagger newly opened windows.
 *
 * Ensures that each window does not completely overlap the previous one.
 *
 * @type {number}
 */
export const WINDOW_OFFSET = 10

/**
 * Initial z-index value for application windows.
 *
 * Windows with higher z-index on top of others.
 *
 * @type {number}
 */
export const INITIAL_Z_INDEX = 1
