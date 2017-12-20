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
        Pot
        There will eventually be a number here. 😭
        {/* There is {this.props.gameState.potTotal} in the pot. */}
      </h1>
      </div>)
  }
}



export default Pot
