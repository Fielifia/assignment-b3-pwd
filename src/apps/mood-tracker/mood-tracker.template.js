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

.startpage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    text-align: center;
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

mood-history {
display: none;
width: 100%;
background: #cbd6e4;
border-radius: 6px;
color: #000;
}

</style>
<mood-startpage></mood-startpage>
<mood-entry style="display: none;"></mood-entry>
<mood-history style="display: none;"></mood-history>

</div>
`
