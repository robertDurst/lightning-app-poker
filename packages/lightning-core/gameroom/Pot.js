import React from 'react'
import {Link} from 'react-router-dom'
//Components
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
class Pot extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (<div className={styles.choice_box_overall}>
      <h1>
        Pot is
        {this.props.gameState.game && this.props.gameState.game.isActive
           ? ' ' + (this.props.gameState.hand.pot + this.props.gameState.round.pot) : ' None'}
      </h1>
      </div>)
  }
}



export default Pot
