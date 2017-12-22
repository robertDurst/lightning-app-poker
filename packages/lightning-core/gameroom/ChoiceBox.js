import React from 'react'
import { Link } from 'react-router-dom'
//Components
import { RaisedButton, TextField } from 'material-ui';
import reactCSS from 'reactcss'

const styles = reactCSS({
  default: {
    choice_box_overall: {
      display: 'flex',
      width: '100%',
      height: '25%',
      backgroundColor: '#0288D1',
      position: 'absolute',
      top: '5px',
    },
    choice_box_card: {
      flex: 1,
      paddingRight: '5px',
      paddingLeft: '5px',
      backgroundColor: '#0288D1'
    }
  }
})
class ChoiceBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      betAmount: 0
    }
  }
  makePacket(key,val) {
    const packet = {
      id: this.props.pubkey,
      sid: this.props.socket.id
    }
    if (key && val) {
      packet[key] = val;
    }
    return packet
  }
  handleStateRead() {
    console.log("STATE:", this.props.state);
    const packet = this.makePacket();
    console.log(packet);
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
      this.props.socket.emit('START_GAME', this.makePacket())
    }
  }
  handleCall() {
    if (!this.props.socket) {
      console.log("Socket disconnected");
    }
    if (this.props.socket) {
      this.props.socket.emit('CALL', this.makePacket())
    }
  }
  handleBet() {
    if (!this.props.socket) {
      console.log("Socket disconnected");
    }
    if (this.props.socket) {
      this.props.socket.emit('BET',this.makePacket('amount',this.state.betAmount))
    }
  }
  handleFold() {
    if (!this.props.socket) {
      console.log("Socket disconnected");
    }
    if (this.props.socket) {
      this.props.socket.emit('FOLD', this.makePacket())
    }
  }
  handleBetChange(e) {
    this.setState({
      betAmount: parseInt(e.target.value)
    })
  }
  render() {
    return (
      <div name='CB ROOT' style={styles.choice_box_overall}>
      <RaisedButton style={styles.choice_box_card} label="Ready up" onClick={() => {
          this.handleReady()
        }}/>
      <RaisedButton style={styles.choice_box_card} label="Start Game" onClick={() => {
          this.handleStart()
        }}/>
      <RaisedButton style={styles.choice_box_card} label="Call" onClick={() => {
          this.handleCall()
        }}/>
      <RaisedButton style={styles.choice_box_card} label="Bet" onClick={() => {
          this.handleBet()
        }}/>
      <RaisedButton style={styles.choice_box_card} label="Fold" onClick={() => {
          this.handleFold()
        }}/>
      <TextField hintText="Bet Amount" onChange={(e)=>{this.handleBetChange(e)}}/><br/>
    </div>)
  }
}

module.exports = ChoiceBox
