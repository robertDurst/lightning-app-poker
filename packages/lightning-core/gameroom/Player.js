import React from 'react'
import {Link} from 'react-router-dom'
import Accessibility from 'material-ui/svg-icons/action/accessibility'
//Components
import styles from './Player.js'
class Player extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
    <div className={styles.Player}>
      {this.props.title}{this.props.name}
      <Accessibility />
    </div>
  )
  }
}

module.exports = Player
