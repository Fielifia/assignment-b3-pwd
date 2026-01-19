# `<mood-entry>` - Mood Tracker Entry Component
A reusable Web Component for creating mood tracker entries.
The component allows users to:
- Select a mood from predefined options
- Rate energy level and sleep
- Select multiple feelings and/or add custom feelings
- Add optional notes
- Save entries via a custom event

The component is built using **Vanilla JavaScript**, **Web Components**, and **Shadow DOM**.

---

## Features
- Select a mood using Font Awesome icons
- Rate energy level (1–5)
- Log sleep hours and rate sleep quality (Poor–Okay–Good)
- Select multiple predefined feelings
- Add up to two custom feelings
- Write optional notes
- Save entries and emit structured data
- Provides two buttons for navigation:
  - **Go back** → navigates to the start page
  - **View history** → navigates to the history page

All UI logic and state handling are encapsulated within the component.

---

## Usage

```html
<mood-entry></mood-entry>
```

The component controls its own rendering and does not require any attributes to function.

---

## Events 

### `entry-submit`
Dispatches when the user clicks the **Save** button.
- **Bubbles:** yes
- **Composed:** yes
```js
element.addEventListener('entry-submit', (event) => {
    const data = event.detail // MoodEntryData object
})
```

**Payload (MoodEntryData):**
```js
{
    id: string,
    date: string,
    mood: {
        icon: string,
        label: string,
        color: string
    },
    energy: string,
    sleep: {
        hours: number,
        quality: string
    },
    feelings: string[],
    notes: string
}
```

### `navigate`
Dispatches when the user clicks **Go back** or **View history** buttons.
- **Bubbles:** yes
- **Composed:** yes
```js
element.addEventListener('navigate', (event) => {
    const page = event.detail.page // 'start' | 'history'
    // handle navigation
})
```


**Detail payload:** 
```js
{ page: 'start' | 'history' }
```

---

## Styling
- Styles are scoped inside Shadow DOM
- Uses flexbox for layout and responsive sizing
- Buttons have hover and focus states for better UX
- Font Awesome icons are loaded via CDN inside the component

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
