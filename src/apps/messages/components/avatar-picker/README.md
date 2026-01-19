# `<avatar-picker>` - Avatar Selection Component
A reusable Web Component for selecting a user avatar.

The component:
- Displays a list of selectable avatars
- Allows the user to choose a single avatar
- Emits a custom event when an avatar i selected
- Supports a compact layout variant for sidebar usage

The component is built using **Vanilla JavaScript**, **Web Components**, and **Shadow DOM**.

---

## Features
- Displays a predefined list or custom list of avatars
- Allows selecting exactly one avatar at a time
- Visually highlights the selected avatar
- Dispatches a custom event on selection
- Shows validation feedback if no avatar is selected
- Supports a `sidebar` variant for compact layiout

All UI logic and state handling are encapsulated within the component.

---

## Usage

```html
<avatar-picker></avatar-picker>
```

### Custom avatar list
You can provide a custom list of avatars using the avatars attribute:
```html
<avatar-picker avatars="🕺, 😍, 🤠, 🐲"></avatar-picker>
```
Avatars must be provided as a comma-separated string.

---

## Attributes
### `avatars` (optional)
Defines the list of avatars to display.
- Type: `string`
- Format: comma-separated values
```html
<avatar-picker avatars="🕺, 😍, 🤠, 🐲"></avatar-picker>
```  
If omitted, a default avatar set is used.

### `variant` (optional)
Controls the visual layout of the component.

Supported values:
- `sidebar` – compact layout intended for sidebars or smaller UI areas
```html
<avatar-picker variant="sidebar"></avatar-picker>
```

---

## Events 

### `avatar-selected`
Dispatches when the user selects an avatar.
- **Bubbles:** yes
- **Composed:** yes
```js
avatarPicker.addEventListener('avatar-selected', (event) => {
    const avatar = event.detail.avatar
    // handle selected avatar
})
```
**Detail payload:**
```js
{
    avatar: string
}
```

---

## Public Methods
### `validateSelection()`
Validates `true` if a selection exists, otherwise `false` and displays an error message.
```js
if (avatarPicker.validateSelection()) {
    // proceed
}
```
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
- ES6+ features (let/const, arrow functions, template literals)

Supported in all modern evergreen browsers (Chrome, Firefox, Safari, Edge).

---

## Author
**Sofia Andersson**
Web Programming Student – Linnaeus University
