import React from "react";
import reactCSS from 'reactcss'
import path from 'path';

const styles = reactCSS({
  default: {
    Card: {
      width: '100%',
      flex: '1',
      display: 'flex',
      justifyContent: 'center',
    }
  }
})
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
      <div id="card" style={styles.Card}>
        <img
          className={faceDown === true ? "back" : "front"}
          src={`cards/${card}.svg`}
          style={{ width: "150px", height: "160px" }}
        />
      </div>
    );
  }
}

module.exports = Card;
