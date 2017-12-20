import React from 'react'
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
// Components
import Table from './Table.js';
import Pot from './Pot.js';
import Hand from './Hand.js';
import ChoiceBox from './ChoiceBox.js';

// Styles
import styles from './styles'

class Game extends React.Component {
  constructor(props) {
    super(props)
    console.log('gamestate',this.props);
  }

  render() {
    return (
    <div style={styles.container_overall}>
      <div name='header' style={styles.container_header}>
        <div style={ styles.container_header_item } >Game</div>
        <div style={ styles.container_header_item } >Messages</div>
        <div style={ styles.container_header_item } >Options</div>
        <div style={ styles.container_header_item } >About</div>
        <Link to='/Lobby'><div style={styles.container_header_item}>Leave Game</div></Link>
      </div>
      <div name='body' style={styles.container_body}>
        <div name='body-top' style={styles.container_body_top}>
          <Table gameState={this.props.gameState}/>
        </div>
        <div name='body-bottom' style={styles.container_body_bottom}>
          <div name='pot' style={styles.info_item}>
            <Pot gameState={this.props.gameState} />
          </div>
          <div name='hand'style={styles.info_item}>
            <Hand gameState={this.props.gameState}/>
          </div>
          <div name='choices'style={styles.info_item}>
            <ChoiceBox gameState={this.props.gameState} socket={this.props.socket} state={this.props.state}/>
          </div>
        </div>
      </div>
      <div name='footer' className={styles.container_footer}>
        FOOTER
      </div>
      //
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
    state: state.core,
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Game);
