# `<date-time-display>` - Date and Time Display Component
A reusable Web Component for displaying a formatted date, time, or both.

The component:
- Displays date, time, or a combination of both
- Supports optional live updating seconds
- Uses browser locale formatting
- Works as a fully self-contained UI element

The component is built using **Vanilla JavaScript**, **Web Components**, and **Shadow DOM**.

---

## Features
- Displays date, time, or datetime
- Optional live clock with seconds update
- Automatically uses the user's locale
- Self-contained and reusable
- Cleans up timers when removed from the DOM

All UI logic and state handling are encapsulated within the component.

---

## Usage

```html
<date-time-display></date-time-display>
```

### With attributes
```html
<date-time-display datetime="2024-06-15T14:30:00" format="datetime" show-seconds></date-time-display>
```

---

## Attributes
### `datetime` (optional)
Defines the date and/or time to display.
- Type: `string`
- Format: Any valid `Date` constructor input (ISO recommended)
```html
<date-time-display datetime="2024-06-15T14:30:00" format="datetime" show-seconds></date-time-display>
```
If omitted, the current date and time is used.

### `format` (optional)
Controls what is displayed.

Supported values:
- `date` – displays only the date
- `time` – displays only the time
- `datetime` – displays both date and time (default) 
```html
<date-time-display format="time"></date-time-display>
```

### `show-seconds` (optional)
Enables seconds in the output and updates the display every second.

- Type: Boolean attribute
```html
<date-time-display format="time" show-seconds></date-time-display>
```

---

## Public Behavior
- Automatically updates every second when `show-seconds` is present
- Starts and stops the internal clock based on lifecycle events
- Re-renders when relevant attributes change

---

## Styling
- Styles are scoped inside Shadow DOM
- Uses flexbox for layout and responsive sizing
- Buttons have hover and selected states for better UX
- Compact styling available via the `sidebar` variant

---

## Browser Support
Requires modern browsers supporting:
- Custom Elements
- Shadow DOM
- ES6+ features (classes, arrow functions, template literals)

Supported in all modern evergreen browsers (Chrome, Firefox, Safari, Edge).

---

## Author
**Sofia Andersson**
Web Programming Student – Linnaeus University
