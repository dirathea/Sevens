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
    const valid = CARD_TYPE.map((val, index) => {
      return index * 13 + 6;
    });
    const discard = _.range(0, 4).reduce((prev, val, index) => {
      prev[index] = [];
      return prev;
    }, {});
    return {board, hands, valid, discard};
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
      if (_.indexOf(G.valid, card) === -1) {
        return G;
      }
      currentBoardState.push(card);
      playerHands.splice(cardIndex, 1);
      const updatedBoard = {...G.board, [type]: _.orderBy(currentBoardState)};
      const updatedHands = {...G.hands, [ctx.currentPlayer]: playerHands};
      return {
          ...G,
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
      const playerDiscard = [...G.discard[ctx.currentPlayer], card];
      const updatedDiscard = {...G.discard, [ctx.currentPlayer]: playerDiscard};
      return {
        ...G,
        hands: updatedHands,
        discard: updatedDiscard,
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
    return {
      board: G.board,
      hands: playerHand,
      valid: validMoves,
    };
  },
  flow: {
    onTurnEnd: (G, ctx) => {
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
        ...G,
        valid: validMoves,
      };
    },
  },
});

export default SevensGame;
