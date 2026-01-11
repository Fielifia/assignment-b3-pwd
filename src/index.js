import './apps/memory/memory-app.js'
import './apps/messages/messages-app.js'
import './apps/mood-tracker/mood-tracker-app.js'
/**
 * Entry point for the Progressive Web Desktop application.
 *
 * @author Sofia Andersson <sa226jf@student.lnu.se>
 * @version 1.0.0
 */

import { PwdShell } from './shell/pwd-shell.js'
/* eslint-disable-next-line no-new */
new PwdShell()
