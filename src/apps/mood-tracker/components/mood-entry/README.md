# `<mood-entry>` - Mood Tracker Entry Component
A reusable Web Component for creating mood tracker entries.
The component allows users to:
- Select a mood from predefined options (Font Awesome icons)
- Rate energy level (1–5)
- Log sleep hours and quality
- Select multiple predefined activities
- Add up to two custom activities
- Write optional notes
- Save entries via a custom event
- Navigate back to the start page or view history

The component is built using **Vanilla JavaScript**, **Web Components**, and **Shadow DOM**.

---

## Features
- Mood selection using icons and color codes
- Energy level dropdown (Terrible–Low–Okay–Good–Great)
- Sleep tracking: hours (number input) and quality (Poor–Okay–Good)
- Multiple activities selection with checkboxes
- Custom activities: up to two text inputs
- Optional notes via a textarea
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
    time: string,
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
    activities: string[],
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
