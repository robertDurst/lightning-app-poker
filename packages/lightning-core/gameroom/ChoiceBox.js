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
      width: '100%',
    }
  }
})
class ChoiceBox extends React.Component {
  constructor(props) {
    super(props)
  }
  handleListStates() {
    console.log('STATES:',this.props.state);
  }
  handleStart() {
    this.props.socket.emit('START_GAME', this.props.gameState)
  }
  // handleDeal() {
  //   this.props.socket.emit('DEAL', this.props.gameState)
  // }
  // handleCall() {
  //   this.props.socket.emit('CALL', {
  //     action: 'CALL',
  //     socketId: this.props.gameState.socketId
  //   })
  // }
  // handleBet() {
  //   this.props.socket.emit('BET', {
  //     action: 'BET',
  //     socketId: this.props.gameState.socketId,
  //     amount: 5
  //   })
  // }
  // handleFold() {
  //   this.props.socket.emit('FOLD', {
  //     action: 'FOLD',
  //     socketId: this.props.gameState.socketId
  //   })
  // }
  handleCheck() {
    this.props.socket.emit('CHECK', this.props.gameState)
  }
  // handleTest() {
  //   this.props.socket.emit('START_BETTING', 123)
  // }
  render() {
    return (
      <div   style={styles.choice_box_overall}>
        ChoiceBox
        <RaisedButton label="LIST STATES" primary={true} onClick={()=>{this.handleListStates()}}/>
        {/* <RaisedButton label="Call" primary={true}/> */}
        {/* <RaisedButton label="Bet" primary={true} onClick={this.handleBet().bind(this)}/> */}
        {/* <RaisedButton label="Fold" primary={true}/> */}
        <RaisedButton label="Start Game" onClick={this.handleStart().bind(this)}/>
        {/* <RaisedButton label="Deal cards" onClick={this.handleDeal().bind(this)}/> */}
        <RaisedButton label="Update Me" onClick={this.handleCheck().bind(this)}/>
        {/* <RaisedButton label="Start Betting Round" onClick={this.handleTest().bind(this)}/> */}
    </div>)
  }
}

module.exports = ChoiceBox
