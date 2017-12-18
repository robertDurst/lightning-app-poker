import React from 'react'
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
//Components
import Table from './Table.js';
import Pot from './Pot.js';
import Hand from './Hand.js';
import ChoiceBox from './ChoiceBox.js';

//styles
import styles from './Gameroom.css'

class Game extends React.Component {
  constructor(props) {
    super(props)
    console.log('gamestate',this.props);
  }

  render() {
    return (
    <div className={styles.container_overall}>
      <div className={styles.container_header}>
        <div className={styles.container_header_item}>Game</div>
        <div className={styles.container_header_item}>Messages</div>
        <div className={styles.container_header_item}>Options</div>
        <div className={styles.container_header_item}>About</div>
        <Link to='/Lobby'><div className={styles.container_header_item}>Leave Game</div></Link>
      </div>
      <div className={styles.container_body}>
        <div className={styles.container_body_top}>
          <Table gameState={this.props.gameState}/>
        </div>
        <div className={styles.container_body_bottom}>
          <div className={styles.info_item}>
            <Pot gameState={this.props.gameState} />
          </div>
          <div className={styles.info_item}>
            <Hand gameState={this.props.gameState}/>
          </div>
          <div className={styles.info_item}>
            <ChoiceBox gameState={this.props.gameState} socket={this.props.socket}/>
          </div>
        </div>
      </div>
      <div className={styles.container_footer}>
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
    gameState: state.gameState,
    socket: state.socket,
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Game);
