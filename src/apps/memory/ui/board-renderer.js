/**
 * Creates a tile DOM element for the memory game.
 *
 * Adds front and back faces, accesibility attributes,
 * and event listeners for click and keyboard interaction.
 *
 * @param {{id: number, value: string, matched: boolean}} tile - Tile data object.
 * @param {(tile: {id:number, value:string, matched:boolean}, tileEl: HTMLElement) => void} flipCallback - Callback when tile is flipped.
 * @returns {HTMLElement} The tile element ready to be appended to the board.
 */
export function createTileElement (tile, flipCallback) {
  const tileEl = document.createElement('div')
  tileEl.classList.add('tile')
  tileEl.setAttribute('tabindex', '0')
  tileEl.setAttribute('role', 'button')
  tileEl.setAttribute('aria-label', 'Memory tile')

  const inner = document.createElement('div')
  inner.classList.add('tile-inner')

  const frontFace = document.createElement('div')
  frontFace.classList.add('front')
  frontFace.textContent = tile.value

  const backFace = document.createElement('div')
  backFace.classList.add('back')

  inner.append(frontFace, backFace)
  tileEl.appendChild(inner)

  tileEl.addEventListener('click', () => flipCallback(tile, tileEl))
  tileEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      flipCallback(tile, tileEl)
    }
  })

  requestAnimationFrame(() => {
    const tileSize = tileEl.clientWidth
    frontFace.style.fontSize = `${tileSize * 0.5}px`
  })

  return tileEl
}

/**
 * Renders the board inside the component.
 *
 * @param {HTMLElement} boardEl - The board container element.
 * @param {Array<{id:number, value:string, matched:boolean}>} tiles - Tile data array.
 * @param {(tile: object, tileEl: HTMLElement) => void} flipCallback - Flip handler.
 * @returns {void}
 */
export function renderBoard (boardEl, tiles, flipCallback) {
  boardEl.innerHTML = ''
  tiles.forEach((tile) =>
    boardEl.appendChild(createTileElement(tile, flipCallback)))
}
