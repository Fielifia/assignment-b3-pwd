const template = document.createElement('template')
template.innerHTML = `
<style>
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
    text-transform: uppercase;
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
<mood-history></mood-history>
</div>
`
export default template
