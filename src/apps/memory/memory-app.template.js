export const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    color: #000;
    display: block;
    max-height: 100vh;
    overflow-y: auto;
    background: #edf2f7;
}

.container {
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;
}

.memory-container {
    display: none;
    flex-direction: column;
    position: relative;
    flex: 1;
}

.memory-game {
    display: none;
    flex: 1;
    gap: .6rem;
    padding: 1rem;
    min-height: 0;
    overflow: auto;
    padding: 1rem;
}

.memory-game.level-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(40px, 1fr));
    font-size: clamp(3rem, 15vw, 7rem);
}

.memory-game.level-4 {
    display: grid;
    grid-template-columns: repeat(4, minmax(40px, 1fr));
    font-size: clamp(1.4rem, 10vw, 3.5rem);
}

.memory-game.level-6 {
    display: grid;
    grid-template-columns: repeat(6, minmax(40px, 1fr));
    font-size: clamp(1rem, 7vw, 3rem);
}

.status {
    display: none;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 5;
    margin: 0;
    background: linear-gradient(145deg, #3f5f73, #5f86a1);
    padding: .5rem;
}

.tile {
    width: 100%;
    flex: 1 1 auto;
    perspective: 1000px;
    min-height: 30px;
    aspect-ratio: 1/1;
    border-radius: 6px;
}

.tile-inner {
    position: relative;
    width: 95%;
    height: 95%;
    inset: 0;
    transform-style: preserve-3d;
    opacity: 1;
    transform: scale(1);
    transition: transform 1s, opacity 3s;
}

.tile.flip .tile-inner {
    transform: rotateY(180deg);
}

.tile.flip {
    transform: scale(1.05);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45),
}

.front,
.back {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    backface-visibility: hidden;
}

.front {
    background: linear-gradient(135deg, #5f86a1, #8fb3cc);
    transform: rotateY(180deg) translateZ(1px);
}

.back {
    background: linear-gradient(145deg, #5f86a1, #3f5f73);
}

:focus-visible {
    outline: 2px solid #4d5f6a;
}

.tile.matched {
    pointer-events: none;
    transform: scale(0.8);
    opacity: 0;
    transition: .6s ease;
}

.tile.matched .tile-inner {
    opacity: 1;
    transform: rotateY(180deg);
}

.message {
    text-align: center;
    margin: 0 auto 1rem;
    max-width: 300px;
}

.controls {
    display: flex;
    max-width: 100%;
    margin: .5rem 1rem;
    padding: 0;
    gap: .5rem;
    align-content: end;
}

button,
select {
    padding: .5rem 1rem;
    border-radius: 6px;
    border: none;
    background: #8fb3cc;
    text-transform: uppercase;
    font-size: clamp(.6rem, 2vw, 1rem);
    transition: .2s ease;
    cursor: pointer;
}

button:hover,
select:hover,
option {
    background: #5f86a1;
    transform: scale(1.05);
    cursor: pointer;
}

.restart-btn {
    margin-left: auto;
    margin-right: auto;
}

.highscore-modal {
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: flex-start;
    display: none;
    box-sizing: border-box;
}

.message {
    display: none;
    font-size: 1.4rem;
    overflow-wrap: break-word;
    padding: 1rem;
}

.question-mark {
    height: 70%;
    width: auto;
}
</style>
<div class="container">
  <nickname-form></nickname-form>
  <div class="memory-container">
    <div class="status"></div>
    <div class="message"></div>
    <div class="memory-game"></div>
  </div>

  <div class="controls">
    <button class="go-back-btn" style="display:none;">Go back</button>
    <button class="restart-btn" style="display:none;">Restart</button>
    <div class="level-select">
      <select id="level">
        <option value="" selected disabled>Select level</option>
        <option value="2">Level 1: 2x2</option>
        <option value="4">Level 2: 4x4</option>
        <option value="6">Level 3: 6x6</option>
      </select>
    </div>
    <button class="show-highscores" style="display:none;">High Scores</button>
  </div>
  <div class="highscore-modal">
    <high-score></high-score>
  </div>
</div>
`
