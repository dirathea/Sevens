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
    return (
      <img
        onClick={() => {
          this.props.moves.playCard(index);
        }}
        style={{
          height: '35vh',
          width: '24vh',
          marginLeft: '-1.5rem',
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
      console.log(boardCardType.length);
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
    const hands = this.props.G.hands;
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
  render() {
    return (
      <div>
        {this.renderBoard()}
        {this.renderHands()}
      </div>
    );
  }
}

export default SevensBoard;
