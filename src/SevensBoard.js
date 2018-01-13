import React, {Component} from 'react';
import _ from 'lodash';
const CardAssets = require.context('./cards', true, /\.svg$/);
const CARD_TYPE = ['spades', 'diamonds', 'hearts', 'clubs'];

const Cards = CardAssets.keys().reduce((images, key) => {
  const cardKey = key.slice(2, key.length - 4);
  images[cardKey] = CardAssets(key);
  return images;
}, {});

class SevensBoard extends Component {
  state = {
    hands: [],
    hasValidMoves: false,
  };

  hasValidMoves = () => {
    const diff = _.intersection(
      this.props.G.valid,
      this.props.G.hands[this.props.ctx.currentPlayer]
    );
    return diff.length > 0;
  };
  getCardName = index => {
    const value = index % 13;
    const typeNumber = _.toInteger(index / 13);
    const type = CARD_TYPE[typeNumber];
    let name = `${value === 0 ? 'ace' : value + 1}`;
    if (value > 9) {
      const diff = value - 10;
      switch (diff) {
        case 0:
          name = 'jack';
          break;
        case 1:
          name = 'queen';
          break;
        case 2:
          name = 'king';
          break;
      }
    }

    return `${name}_of_${type}`;
  };

  getCard = index => {
    const cardName = this.getCardName(index);
    const isValidCard = _.indexOf(this.props.G.valid, index) > -1;
    const hasValidMoves = this.hasValidMoves();
    let opacity = '0.5';
    if (!hasValidMoves) {
      opacity = '1';
    } else if (isValidCard) {
      opacity = '1';
    }
    return (
      <img
        onClick={() => {
          if (!hasValidMoves) {
            this.props.moves.discardCard(index);
            this.props.game.endTurn();
          } else if (isValidCard) {
            this.props.moves.playCard(index);
            this.props.game.endTurn();
          } else {
            console.log(
              `You are not allowed to play ${index} card since you have valid moves`
            );
          }
        }}
        style={{
          height: '35vh',
          width: '24vh',
          marginLeft: '-1.5rem',
          opacity,
        }}
        src={Cards[cardName]}
        alt={cardName}
        key={cardName}
      />
    );
  };

  renderBoardType = type => {
    const boardCardTypes = type.map(val => {
      const cardName = this.getCardName(val);
      return (
        <img
          style={{
            height: '35vh',
            width: '24vh',
          }}
          src={Cards[cardName]}
          alt={`board_${cardName}`}
          key={`board_${cardName}`}
        />
      );
    });
    return boardCardTypes;
  };

  renderBoard = () => {
    const boardCard = Object.keys(this.props.G.board).map(type => {
      const boardCardType = this.props.G.board[type];
      if (boardCardType.length === 0) {
        return (
          <div
            style={{
              border: '1px solid black',
              height: '35vh',
              width: '24vh',
            }}
          />
        );
      }
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          {this.renderBoardType(boardCardType)}
        </div>
      );
    });
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
        {boardCard}
      </div>
    );
  };

  renderHands = () => {
    const hands = this.props.G.hands[this.props.ctx.currentPlayer];
    const cardElements = hands.map(cardHand => {
      return this.getCard(cardHand);
    });
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          paddingLeft: '2rem',
        }}>
        {cardElements}
      </div>
    );
  };

  renderStatus = () => {
    if (!this.hasValidMoves()) {
      return <span>No valid move, please select card to discard</span>;
    }
    return null;
  };
  render() {
    return (
      <div>
        {this.renderBoard()}
        {this.renderStatus()}
        {this.renderHands()}
      </div>
    );
  }
}

export default SevensBoard;
