import React from 'react'
import {Link} from 'react-router-dom'
import Accessibility from 'material-ui/svg-icons/action/accessibility'
//Components
import styles from './player_styles'
class Player extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
    <div style={styles.Player}>
      {this.props.title}{this.props.name}
      <Accessibility />
    </div>
  )
  }
}

module.exports = Player
