# <mood-history>
A Web Component that displays a list of saved mood mood entries, including mood, energy, sleep, feelings, and notes.

The component is built using **Vanilla JavaScript**, **Web Components**, and **Shadow DOM**.

---

## Features
- Displays mood history in a scrollable list
- Shows date, mood (icon + label), energy, sleep, feelings, and notes
- Delete individual entries using the **Delete** button
- Navigate back to start page using **Go back** button

All UI logic and state handling are encapsulated within the component.

---

## Usage

```html
<mood-history></mood-history>
```
**Sets entries programmatically:**
```js
historyComponent.entries = [
    {
        id: '1',
        date: 'Thu, Jan 19, 2026',
        mood: { icon: 'fa-smile-beam', label: 'Content', color: '#c9dcc9'},
        energy: '3',
        sleep: { hours: 8, quality: 'Good'},
        notes: 'Felt productive today!'
    }
]
```
---

## Events
### `delete-entry`
Dispatches when the user deletes an entry.
- **Bubbles:** yes
- **Composed:** yes

```js
historyComponent.addEventListener('delete-entry', (event) => {
    const entryID = event.detail
    // remove entry
})
```
### `navigate`
Dispatches when the **Go back** button is clicked.
```js
historyComponent.addEventListener('navigate', (event) => {
    const page = event.detail.page // 'start'
})
```
---

## Styling
- Styles are scoped inside Shadow DOM
- Grid layout for entries
- Buttons have hover and focus states for better UX
- Scrollable list for history

---

## Browser Support
Requires modern browsers supporting:
- Custom Elements
- Shadow DOM
- ES6+ features (let/const, arrow functions, template literals)

Supported in all modern evergreen browsers (Chrome, Firefox, Safari, Edge).

---

## Author
**Sofia Andersson**
Web Programming Student – Linnaeus University
