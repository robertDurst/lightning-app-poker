import React from 'react'
import {Link} from 'react-router-dom'
import Accessibility from 'material-ui/svg-icons/action/accessibility'
//Components
import styles from './player_styles'
import gifSearch from 'gif-search'

import { Paper } from 'material-ui';


class Player extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gifUrl: ""
    }
  }
  async componentDidMount() {
    const nameArr = this.props.name.split(" ");
    const gifUrl = await gifSearch.query(nameArr[nameArr.length-1]);
    console.log("here", gifUrl);
    this.setState({
      gifUrl
    })
  }
  render() {
    return (
      <Paper style={styles.Player} zDepth={4} >
        <div style={styles.img_container}>
          <img style={styles.img} src={this.state.gifUrl ? this.state.gifUrl : ""} />
        </div>
        <div style={styles.info_container}>
          <div style={styles.displayName}>{this.props.name}</div>
          <div style={styles.amountBet}>Amount bet:
            <p>{this.props.currentBet / 100000000} BTC</p>
          </div>
        </div>
          {/* {this.props.title}{this.props.name} <br /> */}
      </Paper>
    // <div style={styles.Player}>
    //   <img style={{width: '75px', height: '75px'}} src={this.state.gifUrl ? this.state.gifUrl : ""} />
    //   {this.props.title}{this.props.name} <br />
    //   AMT in: {this.props.currentBet}
    //
    // </div>
  )
  }
}

module.exports = Player
