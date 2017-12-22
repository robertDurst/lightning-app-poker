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
    },
    img: {
      width: '100px',
      height: '100px'
    },
    title: {
      fontSize: '50pt',
      color: 'black'
    },
    amount: {
      fontSize: '25pt',
      color: 'black'
    }
  }
})
class Pot extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      empty_url: 'https://image.flaticon.com/icons/svg/3/3546.svg',
      some_url: 'https://image.flaticon.com/icons/svg/138/138281.svg',
      medium_url: 'https://image.flaticon.com/icons/svg/189/189093.svg',
      lots_url: 'https://image.flaticon.com/icons/svg/585/585673.svg'
    }
  }
  render() {
    let img_url = this.state.empty_url;
    if(this.props.gameState.game && this.props.gameState.game.isActive) {
      const pot = parseInt(this.props.gameState.hand.pot) + parseInt(this.props.gameState.round.pot)
      if(pot > 10000) img_url = this.state.lots_url;
      else if(pot > 6000) img_url = this.state.medium_url;
      else if(pot > 0) img_url = this.state.some_url;
    }

    return (<div className={styles.choice_box_overall}>

        <h1 style={styles.title}>Pot</h1>
        {
          <img style={styles.img} src={img_url} />
        }
      <p style={styles.amount}>  {this.props.gameState.game && this.props.gameState.game.isActive
           ? ' ' + ((parseInt(this.props.gameState.hand.pot) + parseInt(this.props.gameState.round.pot))/100000000) + " BTC" : ' None'}
         </p>


      </div>)
  }
}



export default Pot
