# `<nickname-form>` - Nickname Input Component
A reusable Web Component for collecting and validating a user nickname.

The component:
- Prompts the user to enter a nickname
- Vaidates the input before submission
- Emits a custom event when a valid nickname is submitted
- Supports customizable labels and button text
- Supports compact layout variant for sidebar usage

The component is built using **Vanilla JavaScript**, **Web Components**, and **Shadow DOM**.

---

## Features
- Renders a nickname input form
- Validates user input before submission
- Displays error feedback for invalid input
- Dispatches a custom event with the submitted nickname
- Automatically focuses the input field on mount
- Supports a `sidebar` variant for compact layout
- Allows custom label and button text via attributes

All UI logic and state handling are encapsulated within the component.

---

## Usage

```html
<nickname-form></nickname-form>
```

### Custom texts
```html
<nickname-form label-text="Your name" button-text="Join"></nickname-form>
```

---

## Attributes
### `label-text` (optional)
Custom text for the input label.
- Type: `string`
```html
<nickname-form label-text="Enter your name"></nickname-form>
```

### `button-text` (optional)
Custom text for the submit button.
- Type: `string`
```html
<nickname-form button-text="Start"></nickname-form>
```

### `variant` (optional)
Controls the visual layout of the component.

Supported values:
- `sidebar` – compact layout intended for sidebars or small UI areas
```html
<nickname-form variant="sidebar"></nickname-form>
```

---

## Events
### `nickname-submitted`
Dispatches when a valid nickname is submitted.
- **Bubbles:** yes
- **Composed:** yes

```js
nicknameForm.addEventListener('nickname-submitted', (event) => {
    const nickname = event.detail
    // handle nickname
})
```
**Detail payload:**
```js
string
```

## Validation Behavior
- Empty or whitespace-only input is rejected
- Displays an inline error message if validation fails
- Dispatches the event only when the input is valid

---

## Styling
- Styles are scoped inside Shadow DOM
- Uses flexbox for layout
- Buttons have hover and selected states for better UX
- Compact styling available via the `sidebar` variant

---

## Browser Support
Requires modern browsers supporting:
- Custom Elements
- Shadow DOM
- ES6+ features (classes, private methods, template literals)

Supported in all modern evergreen browsers (Chrome, Firefox, Safari, Edge).

---

## Author
**Sofia Andersson**
Web Programming Student – Linnaeus University
