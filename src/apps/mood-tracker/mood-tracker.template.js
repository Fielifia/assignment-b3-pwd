export const template = document.createElement('template')
template.innerHTML = `
<style>
:hst {
margin: 0;
padding: 0;
box-sizing: border-box;
}
.mood-tracker-container {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    font-size: clamp(.9rem, 1.5vw + .6rem, 1rem);
    gap: .5rem;
    justify-content: center;
    align-items: center;
    margin-top: 0;
    padding: 0;
    border-radius: 6px;
}

h2 {
margin: 1rem auto 0;
text-transform: uppercase;
}

button {
  padding: .5rem 1rem;
  border-radius: 6px;
  border: none;
  background: #8fb3cc;
  color: #000;
  text-transform: uppercase;
  font-weight: 500;
  transition: .2s ease;
  cursor: pointer;
}

button:hover{
  background: #5f86a1;
  transform: scale(1.05);
  cursor: pointer;
}

:focus-visible {
  outline: 2px solid #4d5f6a;
}
.error-msg {
  color: #ff6b6b;
}

</style>

<div class="mood-tracker-container">
<h2>Mood Tracker</h2>
<mood-entry></mood-entry>
<button class="show-history-btn">History</button>
<mood-history></mood-history>
</div>
`
