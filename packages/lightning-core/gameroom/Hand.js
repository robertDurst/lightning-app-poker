import React from 'react'
import {Link} from 'react-router-dom'
// import cardTranslator from './cardTranslator.js'
//Components
import Card from './Card.js';
import reactCSS from 'reactcss'
class Hand extends React.Component {
  constructor(props) {
    super(props)
  }
  cardTranslator(value, suite) {
    let retStr = ""
    switch(value) {
      case 1:
        retStr = 'A';
        break;
      case 11:
        retStr = 'J';
        break;
      case 12:
        retStr = 'Q';
        break;
      case 13:
        retStr = 'K';
        break;
      default:
        retStr = value.toString();
    }


    retStr = retStr + suite[0];
    return retStr;
  }

  render() {
    const styles = reactCSS({
      default: {
        Hand_overall: {
          display: 'flex',
        },
      }})
    return (
    <div className={styles.Hand_overall}>
      {
        this.props.gameState.game && this.props.gameState.game.isActive && this.props.gameState.player && this.props.gameState.player.hand
        ? this.props.gameState.player.hand.map( x => {
          return <Card  card={this.cardTranslator(x.value, x.suite)} />
        }) : <div></div>
      }
    </div>
  )
  }
}

module.exports = Hand
