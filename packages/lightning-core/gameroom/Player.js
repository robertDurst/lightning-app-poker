import React from 'react'
import {Link} from 'react-router-dom'
import Accessibility from 'material-ui/svg-icons/action/accessibility'
//Components
import styles from './player_styles'
import gifSearch from 'gif-search'

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
    <div style={styles.Player}>
      <img style={{width: '75px', height: '75px'}} src={this.state.gifUrl ? this.state.gifUrl : ""} />
      {this.props.title}{this.props.name} <br />
      AMT in: {this.props.currentBet}

    </div>
  )
  }
}

module.exports = Player
