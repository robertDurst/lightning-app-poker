import React from 'react'
import {Link} from 'react-router-dom'
//Components
import Card from './Card.js'
import Player from './Player.js'
import styles from './table_styles'


class Table extends React.Component {
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
    // console.log(retStr);
    return retStr;
  }

  render() {
    let bet = {};
    if(this.props.gameState.game) {
      let bets = this.props.gameState.game.bets;
      Object.keys(bets).forEach( x => {
        const betObj = bets[x];
        Object.keys(betObj).forEach( x => {
          if(bet.hasOwnProperty(x)) bet[x] += betObj[x];
          else bet[x] = betObj[x];
        })
      })
    }


    return (
    <div style={styles.Table_overall}>
      <div style={styles.Table_player_bar}>
        PLAYERS LIST
        {
          this.props.gameState.game && this.props.gameState.game.isActive && this.props.gameState.players && this.props.gameState.players.length
          ? this.props.gameState.players.map( player => {
            return <Player  name={player.displayName} key={player.id} currentBet={bet[player.id] ? bet[player.id] : 0}/>
          }) : <div></div>
        }
      </div>
      <div style={styles.Table_table}>
        <div style={styles.Table_table_top}>
          CARDS OF SPREAD
          {
            this.props.gameState.game && this.props.gameState.game.isActive && this.props.gameState.hand && this.props.gameState.hand.spread.length
            ? this.props.gameState.hand.spread.map( x => {
              return <Card  card={this.cardTranslator(x.value, x.suite)} />
            }) : <div></div>
          }
        </div>
      </div>
    </div>
  )
  }
}

module.exports = Table
