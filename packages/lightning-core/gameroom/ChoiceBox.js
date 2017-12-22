import React from 'react'
import {Link} from 'react-router-dom'
//Components
import RaisedButton from 'material-ui/RaisedButton';
import reactCSS from 'reactcss'

const styles = reactCSS({
  default: {
    choice_box_overall: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }
  }
})
class ChoiceBox extends React.Component {
  constructor(props) {
    super(props)
    this.packet = {
      id: props.state.core.accounts.pubkey,
      socketId: props.socket.id
    };
  }

  handleStateRead() {
    console.log("STATE:", this.props.state);
  }
  handleCheck() {
    if (this.props.socket) {
      console.log("CHECK EMITTED");
      this.props.socket.emit('CHECK', {
        id: this.props.pubkey,
        sid: this.props.socket.id
      })
    } else {
      console.log("NO SOCKET");
    }
  }
  handleReady() {
    if (!this.props.socket) {
      console.log("Socket disconnected");
    }
    if (!this.props.pubkey) {
      console.log("Pubkey not available");
    }
    if (this.props.socket) {
      this.props.socket.emit('READY_UP', {
        id: this.props.pubkey,
        displayName: this.props.player.name,
        socketId: this.props.socket.id,
        balance: this.props.state.core.accounts.balances.channel
      })
    }
  }
  handleStart() {
    if (!this.props.socket) {
      console.log("Socket disconnected");
    }
    if (this.props.socket) {
      this.props.socket.emit('START_GAME', this.props.gameState)
    }
  }
  handleCall() {
    if (!this.props.socket) {
      console.log("Socket disconnected");
    }
    if (this.props.socket) {
      this.props.socket.emit('CALL', this.packet)
    }
  }
  handleBet() {
    if (!this.props.socket) {
      console.log("Socket disconnected");
    }
    if (this.props.socket) {
      this.props.socket.emit('BET', {
        id: this.props.pubkey,
        amount: 2000
      })
    }
  }
  handleFold() {
    if (!this.props.socket) {
      console.log("Socket disconnected");
    }
    if (this.props.socket) {
      this.props.socket.emit('FOLD', this.packet)
    }
  }
  render() {
    return (<div style={styles.choice_box_overall}>
      ChoiceBox
      <RaisedButton label="Log local state" onClick={() => {
          this.handleStateRead()
        }}/>
      <RaisedButton label="Check host game state" onClick={() => {
          this.handleCheck()
        }}/>
      <RaisedButton label="Ready up" onClick={() => {
          this.handleReady()
        }}/>
      <RaisedButton label="Start Game" onClick={() => {
          this.handleStart()
        }}/>
      <RaisedButton label="Call" onClick={() => {
          this.handleCall()
        }}/>
      <RaisedButton label="Bet" onClick={() => {
          this.handleBet()
        }}/>
      <RaisedButton label="Fold" onClick={() => {
          this.handleFold()
        }}/>
    </div>)
  }
}

module.exports = ChoiceBox
