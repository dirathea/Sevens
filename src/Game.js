import {Client} from 'boardgame.io/client';
import SevensBoard from './SevensBoard';
import Sevens from "./SevensGame";

const SevensGame = Client({
  game: Sevens,
  numPlayers: 4,
  board: SevensBoard,
});

export default SevensGame;
