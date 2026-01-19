# `<mood-startpage>`- Mood Tracker Start Page Component
A Web Component that serves as the start page for the Mood Tracker App.
It displays a time-based greeting and buttons to navigate to the **create entry** or **history** pages.

The component is built using **Vanilla JavaScript**, **Web Components**, and **Shadow DOM**.

---

## Features
- Displays a greeting based on the current time of day:
  - Morning: 5:00 – 11:59 → "Good Morning"
  - Afternoon: 12:00 – 17:59 → "Good Afternoon"
  - Evening: 18:00 – 4:59 → "Good Evening"
- Provides two buttons for navigation:
  - **Create new entry** → navigates to the mood entry page
  - **View history** → navigates to the history page

All UI logic and state handling are encapsulated within the component.

---

## Usage
```html
<mood-startpage></mood-startpage>
```

This component controls its own rendering and does not require any attributes.

---

## Events
### `navigate`
Dispatches when the user clicks **Create new entry** or **View history** buttons.
- **Bubbles:** yes
- **Composed:** yes

```js
element.addEventListener('navigate', (event) => {
    const page = event.detail.page // 'entry' | 'history'
    // handle navigation
})
```

**Detail payload:**
```js
{ page : 'entry' | 'history' }
```

---

## Styling
- Styles are scoped inside Shadow DOM
- Uses flexbox for layout and responsive sizing
- Buttons have hover and focus states for better UX

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
