import {Game} from 'boardgame.io/core';
import _ from 'lodash';

const CARD_TYPE = ['spades', 'diamonds', 'hearts', 'clubs'];

const SevensGame = Game({
  name: 'Sevens',
  setup: () => {
    const board = CARD_TYPE.reduce((prev, curr) => {
      prev[curr] = [];
      return prev;
    }, {});
    const hands = _.chunk(_.shuffle(_.range(0, 52)), 13);
    return {board, hands};
  },
  moves: {
    playCard(G, ctx, card) {
      const playerHands = [...G.hands[ctx.currentPlayer]];
      const cardIndex = _.indexOf(playerHands, card);
      if (cardIndex === -1) {
        return G;
      }
      //  Check card is playable
      const typeNumber = _.toInteger(card / 13);
      const type = CARD_TYPE[typeNumber];
      const currentBoardState = [...G.board[type]];
      console.log(currentBoardState);
      console.log(
        `card is ${card} type is ${type}, card value is ${card % 13}`
      );
      if (currentBoardState.length !== 0) {
        //  Adding card into not empty lane
        const lowestCard = _.first(currentBoardState);
        const highestCard = _.last(currentBoardState);
        console.log(`valid moves is ${lowestCard - 1} or ${highestCard + 1}`);
        if (lowestCard - card === 1) {
          currentBoardState.unshift(card);
          playerHands.splice(cardIndex, 1);
        } else if (card - highestCard === 1) {
          currentBoardState.push(card);
          playerHands.splice(cardIndex, 1);
        } else {
          //  What's going on here?? invalid card to play actually.
          return G;
        }
      } else {
        //  The card must be 7 to added into board
        const cardValue = card % 13;
        if (cardValue % 6 === 0) {
          currentBoardState.push(card);
          playerHands.splice(cardIndex, 1);
        }
      }
      const updatedBoard = {...G.board, [type]: currentBoardState};
      const updatedHands = {...G.hands, [ctx.currentPlayer]: playerHands};
      return {
        board: updatedBoard,
        hands: updatedHands,
      };
    },
    discardCard(G, ctx, card) {
      const currentPlayerHands = [...G.hands[ctx.currentPlayer]];
      const cardIndex = _.indexOf(currentPlayerHands, card);
      if (cardIndex === -1) {
        return G;
      }
      currentPlayerHands.splice(cardIndex, 1);
      const updatedHands = {
        ...G.hands,
        [ctx.currentPlayer]: currentPlayerHands,
      };
      return {
        ...G,
        hands: updatedHands,
      };
    },
  },
  playerView: (G, ctx, playerId) => {
    const playerHand = [...G.hands[playerId]];
    const validMoves = Object.keys(G.board).reduce((prev, curr) => {
      const singleBoard = G.board[curr];
      if (singleBoard.length === 0) {
        prev.push(CARD_TYPE.indexOf(curr) * 13 + 6);
      } else {
        prev.push(_.first(singleBoard) - 1, _.last(singleBoard) + 1);
      }
      return prev;
    }, []);
    console.log(validMoves);
    return {
      board: G.board,
      hands: playerHand,
      valid: validMoves,
    };
  },
  flow: {
    movesPerTurn: 1,
  },
});

export default SevensGame;
