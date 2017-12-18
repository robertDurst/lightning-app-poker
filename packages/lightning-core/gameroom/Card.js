import React from "react";
import styles from './Card.css'


class Card extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.rotationY !== this.props.rotationY) {
      return true;
    }

    if (nextProps.size !== this.props.size) {
      return true;
    }

    return false;
  }
  render() {
    const { index, card, size, faceDown, rotationY } = this.props;

    return (
      <div id="card" className={styles.Card}>
        <img
          className={faceDown === true ? "back" : "front"}
          src={`cards/${card}.svg`}
          style={{ width: "100px", height: "auto" }}
        />
      </div>
    );
  }
}

module.exports = Card;
