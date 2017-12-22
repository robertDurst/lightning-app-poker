import React from 'react'
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
// Components
import Table from './Table.js';
import Pot from './Pot.js';
import Hand from './Hand.js';
import ChoiceBox from './ChoiceBox.js';
import Player from './Player.js'
import Card from './Card.js';

import { RaisedButton } from 'material-ui';

import axios from 'axios';

// Styles
import styles from './styles'

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      btcPrice: 0,
    }
    this.timerPrice = null;
  }

  componentDidMount() {

    axios.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
    .then( x => this.setState({
      btcPrice: x.data.USD
    }))
    .catch( err => console.log(err))

    this.timerPrice = setInterval(()=>{
      axios.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
      .then( x => this.setState({
        btcPrice: x.data.USD
      }))
      .catch( err => console.log(err))
    }, 30000)
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
      <div style={styles.container_overall}>
        <div name='header' style={styles.container_header}>
          <div style={styles.header_left}>
            <Link to='/Lobby'>
              <RaisedButton
                label={"Leave Game"}
              />
            </Link>
          </div>

          <div style={styles.header_center}>

            <h1 style={styles.header_title}>{this.props.roomname}</h1>
          </div>

          <div style={styles.header_right}>

            <div  style={styles.header_right_column_balance}>
              <div style={styles.header_right_text}>
                <img style={styles.header_logo} src="https://seeklogo.com/images/B/bitcoin-logo-DDAEEA68FA-seeklogo.com.png" />
                {
                  ((this.props.state.core.accounts.balances.channel)/100000000).toFixed(5)
                }
              </div>
              <div style={styles.header_right_text}>
                <img style={styles.header_logo} src="https://t7.rbxcdn.com/f0524f9b622c56c7a31a85a167579a42" />
                {
                  (((this.props.state.core.accounts.balances.channel)/100000000) * this.state.btcPrice).toFixed(2)
                }
              </div>
            </div>
          </div>
        </div>
        <div name='body' style={styles.container_body}>
          <div style={styles.container_body_players}>
            {
              // <Player  name={"Peter"} key={1} currentBet={10}/>
              this.props.gameState.game && this.props.gameState.game.isActive && this.props.gameState.players && this.props.gameState.players.length
              ? this.props.gameState.players.map( player => {
                return <Player  name={player.displayName} key={player.id} currentBet={bet ? (bet[player.id] ? bet[player.id] : 0) : 0}/>
              }) : <div></div>
            }
          </div>
          <div style={styles.container_body_gamespread}>
            <div style={styles.container_body_gamespread_cards}>
              {
                this.props.gameState.game && this.props.gameState.game.isActive && this.props.gameState.hand && this.props.gameState.hand.spread.length
                ? this.props.gameState.hand.spread.map( x => {
                  return <Card
                    card={this.cardTranslator(x.value, x.suite)} />
                }) : <div></div>
              }
            </div>
            <div style={styles.container_body_gamespread_pot}>
              <Pot gameState={this.props.gameState} />
            </div>
          </div>
          <div style={styles.container_body_hand}>
            <div style={styles.container_body_your_cards}>
              <Hand gameState={this.props.gameState}/>
            </div>
            <div name='CB container' style={styles.container_body_choicebox}>
              <ChoiceBox pubkey={this.props.pubkey} gameState={this.props.gameState} socket={this.props.socket} state={this.props.state} player={this.props.player}/>
            </div>
          </div>
        </div>
        <div name='footer' style={styles.container_footer}>
          <marquee style={styles.container_footer_marquee}>{
            this.props.gameState.hand ?
            (this.props.gameState.hand.order[0] === this.props.state.core.accounts.pubkey
                  ? "YOUR TURN, make a move."
                  : this.props.gameState.players.filter( player => player.id === this.props.gameState.hand.order[0])[0].displayName + " is playing.")
            : ""
          }</marquee>
        </div>
      </div>
  )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // onUserMadeMove: (move) => dispatch(userMadeMove(move)),
  };
};

const mapStateToProps = (state) => {
  return {
    gameState: state.core.game,
    socket: state.core.socket,
    player: state.core.player,
    state: state,
    pubkey: state.core.accounts.pubkey,
    roomname: state.core.player.roomname ? state.core.player.roomname : state.core.player.roomname + '\' Game'
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Game);
