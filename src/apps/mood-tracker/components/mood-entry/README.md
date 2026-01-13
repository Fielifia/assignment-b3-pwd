# <mood-entry>
A web component for entering daily mood, energy, sleep, and notes.

## Attributes
| Attribute | Description | Default
|-----------|-------------|---------|
| moods     | Comma-separated list of mood emojis and labels (format: emoji-label). | 😁 Happy, ☺️ Content, 😐Neutral, 😴Tired, 😒Bored, 😟Anxious, 😢Sad, 😡Angry |

## Events
| Event Name   | Fired When |
|--------------|------------|
| entry-submit | When the user clicks the Save button after selecting a mood, energy, sleep, and optional notes. |

### Example Event Detail
```js
{
    date: "2026-01-13",
    mood: {emoji: "😊", label: "Content"},
    energy: "4",
    sleep: {hours: 8, quality: "Good"},
    notes: "Felt productive today!"
}

```html
<mood entry moods="😁-Happy,☺️-Content,😐-Neutral"></mood-entry>

<script type="module">
    import './mood-entry.js'

    const moodEntry = document.querySelector('mood-entry')
    moodEntry.addEventListener('entry-submit', (e) => {
        console.log('New mood entry:', e.detail)
        })
 </script>
