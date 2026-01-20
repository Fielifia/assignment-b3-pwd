export const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
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
    background: #fff;
}


.greeting {
  font-size: clamp(1.5rem, 2vw, 2.5rem);
  color: #4d5f6a;
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


date-time-display {
    display: block;
    padding: .5rem;
    background: linear-gradient(145deg, #dde7ef, #8fb3cc);
    color: #000;
    text-align: right;
    box-shadow: inset 0 -1px 0 rgba(0,0,0,0.05);
}
</style>
<date-time-display datetime="" format="datetime" show-seconds></date-time-display>

<mood-startpage></mood-startpage>
<mood-entry style="display: none;"></mood-entry>
<mood-history style="display: none;"></mood-history>

</div>
`
