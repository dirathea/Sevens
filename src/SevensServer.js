const Server = require('boardgame.io/server');
const game = require('./SevensGame');

const app = Server({
  // The return value of Game().
  game: game,

  // The number of players.
  numPlayers: 4
});

app.listen(8000);