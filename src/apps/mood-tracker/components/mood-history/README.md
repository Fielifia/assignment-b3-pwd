# <mood-history>
A web component displaying a list of previously recorded mood entries, including mood, energy, sleep, and notes.

## Attributes
| Attribute | Description | Default
|-----------|-------------|---------|
| (none)     | This component does not have attributes. It relies on passing entries via methods or events | N/A |

## Events
| Event Name   | Fired When |
|--------------|------------|
| delete-entry | When the user clicks the delete button for a specific entry. The `detail` contains the date of the entry to delete. |

### Example Event Detail
```js
"2026-01-13" // The date of the entry the user wants to delete
```

```html
<mood-history></mood-history>

<script type="module">
    import './mood-history.js'

    const history = document.querySelector('mood-history')

    // Example data
    const entries = [
        {
            date: "2026-01-13",
            mood: {emoji: "😊", label: "Content"},
            energy: "4",
            sleep: {hours: 8, quality: "Good"},
            notes: "Felt productive today!"
        },
                {
            date: "2026-01-12",
            mood: {emoji: "😐", label: "Neutral"},
            energy: "3",
            sleep: {hours: 7, quality: "Okay"},
            notes: "Average day."
        }
    ]
    // Render entries in the component
    history.getEntries(entries)

    // Listen for delete-entry events.
    history.addEventListener('delete-entry' (e) => {
        console.log('Delete entry for date:', e.detail)
    })
 </script>
```
