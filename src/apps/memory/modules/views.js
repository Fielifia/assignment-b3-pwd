export const VIEWS = {
  START: 'start',
  IN_GAME: 'inGame',
  GAME_END: 'gameEnd',
  HIGHSCORES: 'highscores'
}
export const viewConfig = {
  start: {
    container: 'none',
    board: 'none',
    status: 'none',
    message: 'none',
    nicknameForm: 'block',
    controls: 'flex',
    highScore: 'none',
    toggleControls: {
      levelSelect: true,
      restart: false,
      goBack: false,
      highScore: true
    }
  },

  inGame: {
    container: 'flex',
    board: 'grid',
    status: 'flex',
    message: 'none',
    nicknameForm: 'none',
    controls: 'flex',
    highScore: 'none',
    toggleControls: {
      levelSelect: false,
      restart: true,
      goBack: true,
      highScore: true
    }
  },

  gameEnd: {
    container: 'flex',
    board: 'none',
    status: 'none',
    message: 'block',
    nicknameForm: 'none',
    controls: 'flex',
    highScore: 'flex',
    toggleControls: {
      levelSelect: false,
      restart: true,
      goBack: false,
      highScore: false
    }
  },

  highscores: {
    container: 'flex',
    board: 'none',
    status: 'none',
    message: 'none',
    nicknameForm: 'none',
    controls: 'none',
    highScore: 'flex'
  }
}
