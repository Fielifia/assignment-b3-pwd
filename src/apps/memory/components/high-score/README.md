# `<high-score>` - High Score Component
A reusable Web Component for displaying and managing high scores.

The component:
- Displays the top 5 scores per game level
- Stores scores persistently in `localStorage`
- Allows adding and clearing scores
- Provides navigation back to the gam view

The component is built using **Vanilla JavaScript**, **Web Components**, and **Shadow DOM**.

---

## Features
- Displays **Top 5** high score list per level
- Stores scores in `localStorage` using level-specific keys
- Automatically sorts scores by best (lowest) completion time
- Highlights the most recently added score
- Supports clearing all score for the active level
- Provides a **Go back** button for navigation

All UI logic and state handling are encapsulated within the component.

---

## Usage

```html
<high-score></high-score>
```

The component controls its own rendering and does not require any attributes to function.

---

## Public API
### `setLevel(level)`
Sets the active game level and loads corresponding high scores.
```js
highScoreComponent.setLevel(2)
```  
### `addScore(name, score, level)`
Adds a new high score entry for a specific level.
```js
highScoreComponent.addScore('Player', 42, 2)
```
- Scores are sorted by time (ascending)
- Only the top 5 scores are displayed
### `clearScores(level)`
Clears all stored high scores for a specific level.
```js
highScoreComponent.clearScores(2)
```

---

## Data Structure
Each stored score entry has the following structure:
```js
{
    name: string,
    score: number,
    timestamp: number
}
```
Scores are stored in `localStorage` using the key format:
```text
memory_highscores:level{level}
```

---

## Events 

### `highscore-back`
Dispatches when the user clicks the **Go back** button.
- **Bubbles:** yes
- **Composed:** yes
```js
highScoreComponent.addEventListener('highscore-back', () => {
    // close high score view
})
```

---

## Styling
- Styles are scoped inside Shadow DOM
- Uses a table layout for clear score presentation
- Buttons have hover and focus states for better UX
- Highlights the most recent score entry

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
